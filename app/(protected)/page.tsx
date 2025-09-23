import { getUser} from "@/actions/user.action";
import { UploadForm } from "@/components/upload-pdf-form";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const user = await getUser();
  if(!user) {
      redirect("/auth/login");
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Chat with your Document</h1>
        <p className="text-muted-foreground">
          Upload a document and start a conversation with it. We support PDF,
          Word documents and text files.
        </p>
      </div>
      <UploadForm user={user}/>
    </div>
  );
}
