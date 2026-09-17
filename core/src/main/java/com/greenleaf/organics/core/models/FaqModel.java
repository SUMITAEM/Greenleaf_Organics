package com.greenleaf.organics.core.models;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import javax.annotation.PostConstruct;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class FaqModel {

    @ValueMapValue
    private String heading;

    @ChildResource(name = "faqItems")
    private List<Resource> faqItemResources;

    private List<FaqItemModel> faqItems;

    @PostConstruct
    protected void init() {
        faqItems = new ArrayList<>();
        if (faqItemResources != null) {
            for (Resource res : faqItemResources) {
                FaqItemModel item = res.adaptTo(FaqItemModel.class);
                if (item != null && item.getQuestion() != null) {
                    faqItems.add(item);
                }
            }
        }
    }

    public String getHeading() {
        return heading;
    }

    public List<FaqItemModel> getFaqItems() {
        return Collections.unmodifiableList(faqItems);
    }
}
