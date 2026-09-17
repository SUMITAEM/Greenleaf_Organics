package com.greenleaf.organics.core.servlets;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.LoginException;
import org.apache.sling.api.resource.PersistenceException;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.api.resource.ResourceUtil;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.apache.sling.servlets.annotations.SlingServletPaths;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.Servlet;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component(service = Servlet.class)
@SlingServletPaths("/bin/greenleaf/comment")
public class BlogCommentServlet extends SlingAllMethodsServlet {

    private static final Logger LOG = LoggerFactory.getLogger(BlogCommentServlet.class);
    private static final String COMMENTS_ROOT = "/var/greenleaf-organics/blog-comments";
    private static final String SUBSERVICE = "greenleaf-forms";

    @Reference
    private ResourceResolverFactory resolverFactory;

    @Override
    protected void doPost(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String name = request.getParameter("name");
        String comment = request.getParameter("comment");
        String pagePath = request.getParameter("pagePath");

        if (name == null || name.trim().isEmpty()
                || comment == null || comment.trim().isEmpty()
                || pagePath == null || pagePath.trim().isEmpty()) {
            response.setStatus(400);
            response.getWriter().write("{\"success\":false,\"message\":\"All fields are required.\"}");
            return;
        }

        String sanitizedPage = pagePath.trim().replaceAll("[^a-zA-Z0-9-]", "");

        try (ResourceResolver resolver = getServiceResolver()) {
            String parentPath = COMMENTS_ROOT + "/" + sanitizedPage;
            ResourceUtil.getOrCreateResource(resolver, parentPath, "sling:Folder", "sling:Folder", true);

            String nodeName = "comment-" + System.currentTimeMillis();
            Resource parent = resolver.getResource(parentPath);
            Map<String, Object> props = new HashMap<>();
            props.put("jcr:primaryType", "nt:unstructured");
            props.put("name", name.trim());
            props.put("comment", comment.trim());
            props.put("createdAt", Calendar.getInstance());

            resolver.create(parent, nodeName, props);
            resolver.commit();

            LOG.info("Blog comment saved for page: {}", sanitizedPage);
            response.getWriter().write("{\"success\":true,\"message\":\"Comment posted!\"}");
        } catch (LoginException | PersistenceException e) {
            LOG.error("Failed to save comment", e);
            response.setStatus(500);
            response.getWriter().write("{\"success\":false,\"message\":\"Failed to post comment.\"}");
        }
    }

    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String pagePath = request.getParameter("pagePath");
        if (pagePath == null || pagePath.trim().isEmpty()) {
            response.getWriter().write("{\"comments\":[]}");
            return;
        }

        String sanitizedPage = pagePath.trim().replaceAll("[^a-zA-Z0-9-]", "");
        SimpleDateFormat sdf = new SimpleDateFormat("MMM dd, yyyy 'at' h:mm a");

        try (ResourceResolver resolver = getServiceResolver()) {
            String parentPath = COMMENTS_ROOT + "/" + sanitizedPage;
            Resource parent = resolver.getResource(parentPath);

            if (parent == null) {
                response.getWriter().write("{\"comments\":[]}");
                return;
            }

            List<String> entries = new ArrayList<>();
            for (Resource child : parent.getChildren()) {
                String n = child.getValueMap().get("name", "");
                String c = child.getValueMap().get("comment", "");
                Calendar cal = child.getValueMap().get("createdAt", Calendar.class);
                String date = cal != null ? sdf.format(cal.getTime()) : "";
                entries.add("{\"name\":\"" + escapeJson(n) + "\",\"comment\":\"" + escapeJson(c) + "\",\"date\":\"" + date + "\"}");
            }

            response.getWriter().write("{\"comments\":[" + String.join(",", entries) + "]}");
        } catch (LoginException e) {
            LOG.error("Failed to load comments", e);
            response.getWriter().write("{\"comments\":[]}");
        }
    }

    private ResourceResolver getServiceResolver() throws LoginException {
        Map<String, Object> param = Collections.singletonMap(
                ResourceResolverFactory.SUBSERVICE, SUBSERVICE);
        return resolverFactory.getServiceResourceResolver(param);
    }

    private String escapeJson(String str) {
        return str.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "");
    }
}
