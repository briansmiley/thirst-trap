import NewProfileForm from "./new-profile-form";

export default async function ProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  return <NewProfileForm id={id} />;
}
