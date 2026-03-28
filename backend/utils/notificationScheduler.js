const cron = require('node-cron');
const Subscription = require('../models/subscriptionModel');
const sendEmail = require('./emailService');

const setupSubscriptionNotifier = () => {
    cron.schedule('0 9 * * *', async() => {
        console.log('Running daily check for expiring subscriptions...');

        try{
            const threeDaysFromNow = new Date();
            threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

            const expiringSubscription = await Subscription.find({
                status: 'active',
                endDate: {
                    $gte: new Date(),
                    $lte: threeDaysFromNow,
                },
            }).populate('user', 'name email');

            if(expiringSubscription.length > 0) {
                console.log(`Found ${expiringSubscription.length} subscription to notify.`);

                for (const sub of expiringSubscription) {
                    const mailOptions = {
                        email: sub.user.email,
                        subjet: 'Your Library Subscription is Expiring Soon!',
                         html: `
              <h1>Subscription Renewal Reminder</h1>
              <p>Hello ${sub.user.name},</p>
              <p>This is a friendly reminder that your <strong>${sub.plan}</strong> subscription is set to expire on ${sub.endDate.toLocaleDateString()}.</p>
              <p>Please renew your plan to continue enjoying uninterrupted access to the library.</p>
              <p>Thank you!</p>
            `,
                    };
                    await sendEmail(mailOptions);
                }
            } else {
                console.log('No expiring subscription found today');
            }
        } catch (error) {
            console.log('Error checking for expiring subscriptions:', error);
        }
    });
};

module.exports = setupSubscriptionNotifier;