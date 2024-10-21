export default function User({ params }: { params: { id: string } }) {
  return <div>User id: {params.id}</div>;
}
