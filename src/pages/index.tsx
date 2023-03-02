import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import Header from "~/components/Header";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import { api, type RouterOutputs } from "~/utils/api";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>T3 Note App</title>
        <meta name="description" content="T3 Note app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Header />
        <Content />
      </main>
    </>
  );
};

export default Home;

type Topic = RouterOutputs["topic"]["getAll"][0];

const Content: React.FC = () => {
  const { data: sessionData } = useSession();

  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  const { data: topics, refetch: refetchTopics } = api.topic.getAll.useQuery(
    undefined, // no input
    {
      enabled: sessionData?.user !== undefined,
      onSuccess: (data) => {
        setSelectedTopic(selectedTopic ?? data[0] ?? null);
      },
    }
  );

  const createTopic = api.topic.create.useMutation({
    onSuccess: () => {
      toast.success("Topic created");
      void refetchTopics();
    },
  });

  return (
    <>
      <div className="mx-5 mt-5 grid grid-cols-4 gap-2">
        <div className="px-2">
          <ul className="menu rounded-box w-56 bg-base-100 p-2">
            {topics?.map((topic) => (
              <li key={topic.id}>
                <a
                  href="#"
                  onClick={(evt) => {
                    evt.preventDefault();
                    setSelectedTopic(topic);
                  }}
                >
                  {topic.title}
                </a>
              </li>
            ))}
          </ul>
          <div className="divider"></div>
          <input
            type="text"
            placeholder="New Topic"
            className="input-bordered input input-sm w-full"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                createTopic.mutate({
                  title: e.currentTarget.value,
                });
                e.currentTarget.value = "";
              }
            }}
          />
          <div className="col-span-3"></div>
        </div>
      </div>
      <Toaster position="bottom-right" reverseOrder={false} />
    </>
  );
};
