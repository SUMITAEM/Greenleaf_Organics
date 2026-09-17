package com.greenleaf.organics.core.services;

import java.util.Map;

public interface FormStorageService {

    Map<String, Object> saveContactSubmission(String name, String email, String message);

    Map<String, Object> saveNewsletterSubscription(String email);

    long getNewsletterSubscriberCount();

    long getContactSubmissionCount();
}
