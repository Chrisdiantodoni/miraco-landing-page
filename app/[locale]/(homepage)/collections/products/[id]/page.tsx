type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ type?: string; id?: string }>;
};

export default async function Page({ params, searchParams }: Props) {
  const { slug } = await params;
  const { type, id } = await searchParams;

  return (
    <div>
      <div>haha</div>
    </div>
  );
}
