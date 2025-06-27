export const subscribeToBlogpostDownloadChannel = ({
  consumer,
  slug,
  setMessage,
  setProgress,
  generatePdf,
}) => {
  const blogpostDownloadSubscription = consumer.subscriptions.create(
    {
      channel: "BlogpostDownloadChannel",
      pubsub_token: slug,
    },
    {
      connected() {
        setMessage("Connected the Cables...");
        generatePdf(slug);
      },
      received(data) {
        const { message, progress } = data;
        setMessage(message);
        setProgress(progress);
      },
    }
  );

  return blogpostDownloadSubscription;
};
