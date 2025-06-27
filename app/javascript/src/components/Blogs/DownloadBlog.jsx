import React, { useEffect, useState } from "react";

import postsApi from "apis/posts";
import { subscribeToBlogpostDownloadChannel } from "channels/BlogPostDownloadChannel";
import createConsumer from "channels/consumer";
import { Button, ProgressBar, PageTitle } from "components/commons";
import FileSaver from "file-saver";
import { useParams, useHistory } from "react-router-dom";

const DownloadBlog = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const { slug } = useParams();

  const consumer = createConsumer();
  const history = useHistory();

  const generatePdf = async slug => {
    try {
      await postsApi.generatePdf(slug);
    } catch (error) {
      logger.error(error);
    }
  };

  const downloadPdf = async slug => {
    setIsLoading(true);
    try {
      const { data } = await postsApi.download(slug);
      FileSaver.saveAs(data, `Blogpost-${slug}.pdf`);
    } catch (error) {
      logger.error(error);
    } finally {
      setIsLoading(false);
      history.push(`/blogs/${slug}/show`);
    }
  };

  useEffect(() => {
    subscribeToBlogpostDownloadChannel({
      consumer,
      slug,
      setMessage,
      setProgress,
      generatePdf,
    });

    return () => {
      consumer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (progress === 100) {
      setIsLoading(false);
      setMessage("Report is ready to be downloaded");
    }
  }, [progress]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-100 p-4">
      <div className="flex flex-col gap-y-8">
        <PageTitle title="Download Blogpost" />
        <div className="mb-4 w-full">
          <div className="mx-auto mb-4 w-full overflow-hidden rounded-lg border border-gray-200 bg-white text-gray-800 sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-2xl">
            <div className="space-y-2 p-6">
              <p className="text-xl font-semibold">{message}</p>
              <ProgressBar progress={progress} />
            </div>
          </div>
          <Button
            buttonText="Download"
            loading={isLoading}
            onClick={() => downloadPdf(slug)}
          />
        </div>
      </div>
    </div>
  );
};

export default DownloadBlog;
