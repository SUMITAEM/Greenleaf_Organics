package com.greenleaf.organics.core.models;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class ProductCardModel {

    @ValueMapValue
    private String productImage;

    @ValueMapValue
    private String productName;

    @ValueMapValue
    private String price;

    @ValueMapValue
    private String badge;

    @ValueMapValue
    private String description;

    @ValueMapValue
    private String linkURL;

    public String getProductImage() {
        return productImage;
    }

    public String getProductName() {
        return productName;
    }

    public String getPrice() {
        return price;
    }

    public String getBadge() {
        return badge;
    }

    public String getDescription() {
        return description;
    }

    public String getLinkURL() {
        return linkURL;
    }
}
