package com.greenleaf.organics.core.servlets;

import com.greenleaf.organics.core.services.FormStorageService;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.apache.sling.servlets.annotations.SlingServletPaths;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import javax.servlet.Servlet;
import java.io.IOException;
import java.util.Map;

@Component(service = Servlet.class)
@SlingServletPaths("/bin/greenleaf/subscribe")
public class NewsletterServlet extends SlingAllMethodsServlet {

    @Reference
    private FormStorageService formStorageService;

    @Override
    protected void doPost(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String email = request.getParameter("email");

        if (email == null || email.trim().isEmpty()) {
            response.setStatus(400);
            response.getWriter().write("{\"success\":false,\"message\":\"Email is required.\"}");
            return;
        }

        if (!email.matches("^[\\w.+-]+@[\\w.-]+\\.[a-zA-Z]{2,}$")) {
            response.setStatus(400);
            response.getWriter().write("{\"success\":false,\"message\":\"Please enter a valid email address.\"}");
            return;
        }

        Map<String, Object> result = formStorageService.saveNewsletterSubscription(email.trim());

        boolean success = (boolean) result.get("success");
        response.setStatus(success ? 200 : 500);
        response.getWriter().write("{\"success\":" + success
                + ",\"message\":\"" + result.get("message") + "\"}");
    }
}
