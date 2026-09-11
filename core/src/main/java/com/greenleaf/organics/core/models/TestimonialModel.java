package com.greenleaf.organics.core.models;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import javax.annotation.PostConstruct;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class TestimonialModel {

    @ValueMapValue
    private String quote;

    @ValueMapValue
    private String authorImage;

    @ValueMapValue
    private String authorName;

    @ValueMapValue
    private String authorRole;

    @ValueMapValue
    private Long starRating;

    private List<Integer> stars;

    @PostConstruct
    protected void init() {
        stars = new ArrayList<>();
        int rating = (starRating != null) ? starRating.intValue() : 0;
        for (int i = 0; i < rating; i++) {
            stars.add(i + 1);
        }
    }

    public String getQuote() {
        return quote;
    }

    public String getAuthorImage() {
        return authorImage;
    }

    public String getAuthorName() {
        return authorName;
    }

    public String getAuthorRole() {
        return authorRole;
    }

    public Long getStarRating() {
        return starRating;
    }

    public List<Integer> getStars() {
        return Collections.unmodifiableList(stars);
    }
}
