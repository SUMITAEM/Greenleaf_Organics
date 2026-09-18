package com.greenleaf.organics.core.models;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import javax.annotation.PostConstruct;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class TeamMembersModel {

    @ValueMapValue
    private String heading;

    @Self
    private Resource resource;

    private List<TeamMemberItem> members;

    @PostConstruct
    protected void init() {
        members = new ArrayList<>();
        Resource membersNode = resource.getChild("members");
        if (membersNode != null) {
            for (Resource child : membersNode.getChildren()) {
                TeamMemberItem item = child.adaptTo(TeamMemberItem.class);
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
