package com.greenleaf.organics.core.services.impl;

import com.greenleaf.organics.core.services.FormStorageService;
import org.apache.sling.api.resource.LoginException;
import org.apache.sling.api.resource.PersistenceException;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.api.resource.ResourceUtil;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Calendar;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Component(service = FormStorageService.class, immediate = true)
public class FormStorageServiceImpl implements FormStorageService {

    private static final Logger LOG = LoggerFactory.getLogger(FormStorageServiceImpl.class);

    private static final String CONTACT_PATH = "/var/greenleaf-organics/contact-submissions";
    private static final String NEWSLETTER_PATH = "/var/greenleaf-organics/newsletter-subscriptions";
    private static final String SUBSERVICE = "greenleaf-forms";

    @Reference
    private ResourceResolverFactory resolverFactory;

    @Override
    public Map<String, Object> saveContactSubmission(String name, String email, String message) {
        Map<String, Object> result = new HashMap<>();
        try (ResourceResolver resolver = getServiceResolver()) {
            ensurePath(resolver, CONTACT_PATH);

            String nodeName = "contact-" + System.currentTimeMillis();
            Resource parent = resolver.getResource(CONTACT_PATH);
            Map<String, Object> props = new HashMap<>();
            props.put("jcr:primaryType", "nt:unstructured");
            props.put("name", name);
            props.put("email", email);
            props.put("message", message);
            props.put("submittedAt", Calendar.getInstance());
            props.put("status", "new");

            resolver.create(parent, nodeName, props);
            resolver.commit();

            LOG.info("Contact form submission saved from: {}", email);
            result.put("success", true);
            result.put("message", "Thank you! We'll get back to you within 24 hours.");
        } catch (LoginException e) {
            LOG.error("Service login failed", e);
            result.put("success", false);
            result.put("message", "System error. Please try again later.");
        } catch (PersistenceException e) {
            LOG.error("Failed to save contact submission", e);
            result.put("success", false);
            result.put("message", "Failed to save your message. Please try again.");
        }
        return result;
    }

    @Override
    public Map<String, Object> saveNewsletterSubscription(String email) {
        Map<String, Object> result = new HashMap<>();
        try (ResourceResolver resolver = getServiceResolver()) {
            ensurePath(resolver, NEWSLETTER_PATH);

            String nodeName = "sub-" + email.toLowerCase().hashCode();
            Resource existing = resolver.getResource(NEWSLETTER_PATH + "/" + nodeName);

            if (existing != null) {
                result.put("success", true);
                result.put("message", "You're already subscribed!");
                return result;
            }

            Resource parent = resolver.getResource(NEWSLETTER_PATH);
            Map<String, Object> props = new HashMap<>();
            props.put("jcr:primaryType", "nt:unstructured");
            props.put("email", email.toLowerCase());
            props.put("subscribedAt", Calendar.getInstance());
            props.put("active", true);

            resolver.create(parent, nodeName, props);
            resolver.commit();

            LOG.info("New newsletter subscriber: {}", email);
            result.put("success", true);
            result.put("message", "You're subscribed! Welcome to Greenleaf.");
        } catch (LoginException e) {
            LOG.error("Service login failed", e);
            result.put("success", false);
            result.put("message", "System error. Please try again later.");
        } catch (PersistenceException e) {
            LOG.error("Failed to save subscription", e);
            result.put("success", false);
            result.put("message", "Subscription failed. Please try again.");
        }
        return result;
    }

    @Override
    public long getNewsletterSubscriberCount() {
        return countChildren(NEWSLETTER_PATH);
    }

    @Override
    public long getContactSubmissionCount() {
        return countChildren(CONTACT_PATH);
    }

    private long countChildren(String path) {
        try (ResourceResolver resolver = getServiceResolver()) {
            Resource resource = resolver.getResource(path);
            if (resource != null) {
                long count = 0;
                for (Resource child : resource.getChildren()) {
                    count++;
                }
                return count;
            }
        } catch (LoginException e) {
            LOG.error("Service login failed for count", e);
        }
        return 0;
    }

    private ResourceResolver getServiceResolver() throws LoginException {
        Map<String, Object> param = Collections.singletonMap(
                ResourceResolverFactory.SUBSERVICE, SUBSERVICE);
        return resolverFactory.getServiceResourceResolver(param);
    }

    private void ensurePath(ResourceResolver resolver, String path) throws PersistenceException {
        ResourceUtil.getOrCreateResource(resolver, path, "sling:Folder", "sling:Folder", true);
    }
}
