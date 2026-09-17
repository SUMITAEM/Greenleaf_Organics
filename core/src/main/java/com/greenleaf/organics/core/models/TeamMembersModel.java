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
public class TeamMembersModel {

    @ValueMapValue
    private String heading;

    @ChildResource(name = "members")
    private List<Resource> memberResources;

    private List<TeamMemberItem> members;

    @PostConstruct
    protected void init() {
        members = new ArrayList<>();
        if (memberResources != null) {
            for (Resource res : memberResources) {
                TeamMemberItem item = res.adaptTo(TeamMemberItem.class);
                if (item != null && item.getName() != null) {
                    members.add(item);
                }
            }
        }
    }

    public String getHeading() { return heading; }

    public List<TeamMemberItem> getMembers() {
        return Collections.unmodifiableList(members);
    }
}
