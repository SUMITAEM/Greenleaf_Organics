package com.greenleaf.organics.core.schedulers;

import com.greenleaf.organics.core.services.FormStorageService;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.Designate;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Designate(ocd = SubscriptionReportScheduler.Config.class)
@Component(service = Runnable.class)
public class SubscriptionReportScheduler implements Runnable {

    private static final Logger LOG = LoggerFactory.getLogger(SubscriptionReportScheduler.class);

    @ObjectClassDefinition(
            name = "Greenleaf Organics - Subscription Report Scheduler",
            description = "Periodically logs newsletter subscriber and contact submission counts")
    public @interface Config {
        @AttributeDefinition(name = "Cron Expression", description = "Cron expression for scheduler frequency")
        String scheduler_expression() default "0 0 * * * ?";

        @AttributeDefinition(name = "Concurrent", description = "Allow concurrent executions")
        boolean scheduler_concurrent() default false;

        @AttributeDefinition(name = "Enabled", description = "Enable the scheduler")
        boolean enabled() default true;
    }

    @Reference
    private FormStorageService formStorageService;

    private boolean enabled;

    @Activate
    protected void activate(Config config) {
        this.enabled = config.enabled();
    }

    @Override
    public void run() {
        if (!enabled) {
            return;
        }

        long subscriberCount = formStorageService.getNewsletterSubscriberCount();
        long contactCount = formStorageService.getContactSubmissionCount();

        LOG.info("=== Greenleaf Organics Report ===");
        LOG.info("Newsletter subscribers: {}", subscriberCount);
        LOG.info("Contact form submissions: {}", contactCount);
        LOG.info("================================");
    }
}
