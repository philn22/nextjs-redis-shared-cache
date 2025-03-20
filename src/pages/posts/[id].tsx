import { GetStaticPaths, GetStaticProps } from "next";

type Post = {
  id: string;
  title: string;
  author: string;
  description: string;
};

type Props = {
  post: Post;
};

const api_url = process.env.NEXT_PUBLIC_API_URL;
const revalidate = process.env.REVALIDATE_TIME ?? "60";

export default function PostDetailPage({ post }: Props) {
  return (
    <div className="space-y-2">
      <h2 className="font-bold">{post.title}</h2>
      <p>{post.author}</p>
      <p>{post.description}</p>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await fetch(`${api_url}/posts?_page=1`);
  const jsonResponse: {
    data: Post[];
  } = await res.json();
  const paths = jsonResponse.data.map((post: Post) => ({
    params: { id: post.id },
  }));

  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  try {
    const res = await fetch(`${api_url}/posts/${params?.id}`);
    if (!res.ok) {
      return { notFound: true };
    }
    const post: Post = await res.json();

    return {
      props: { post },
      revalidate: parseInt(revalidate),
    };
  } catch (error) {
    return { notFound: true };
  }
};
