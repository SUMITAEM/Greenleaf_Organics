package com.greenleaf.organics.core.models;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class HerobannerModel {

    @ValueMapValue
    private String backgroundImage;

    @ValueMapValue
    private String heading;

    @ValueMapValue
    private String subheading;

    @ValueMapValue
    private String ctaLabel;

    @ValueMapValue
    private String ctaLink;

    @ValueMapValue
    private Long overlayOpacity;

    public String getBackgroundImage() {
        return backgroundImage;
    }

    public String getHeading() {
        return heading;
    }

    public String getSubheading() {
        return subheading;
    }

    public String getCtaLabel() {
        return ctaLabel;
    }

    public String getCtaLink() {
        return ctaLink;
    }

    public Long getOverlayOpacity() {
        return overlayOpacity;
    }
}
