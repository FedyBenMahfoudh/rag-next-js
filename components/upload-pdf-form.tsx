"use client";
import { useForm } from "react-hook-form";
import { Icons } from "./icons";
import { Button } from "./ui/button";
import { FileUpload } from "./ui/file-upload";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { useState } from "react";
import toast from "react-hot-toast";
import {User} from "@supabase/supabase-js";
import {createNewConversation} from "@/actions/conversations.actions";
import {uploadFile} from "@/actions/storage.actions";
import {embedFile, insertFiles} from "@/actions/file.actions";
import {MultiStepLoader} from "@/components/ui/multi-step-loader";
import {useRouter} from "next/navigation";

// Define the form schema
const formSchema = z.object({
  conversationName: z.string().min(4, "conversation Name is required"),
});

type FormValues = z.infer<typeof formSchema>;

const loadingStates = [
    { text: "🧩 Processing contents..." },
    { text: "🔎 Checking documents..." },
    { text: "ℹ️ Getting info..." },
    { text: "🤖 Ready to chat!" },
];

export const UploadForm = ({user} : {user : User}) => {
  const [documents, setDocuments] = useState<File[]>([]);
  const [loading, setIsLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const router = useRouter();

    const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      conversationName: "",
    },
  });

  const handleFilesUpload = (files: File[]) => {
    const validTypes = ["application/pdf", "text/plain"];
    const tenMB = 10 * 1024 * 1024;
    if (files.length > 2) {
      toast.error("Only 2 Files allowed");
      return;
    }
    for (const file of files) {
      if (!validTypes.includes(file.type)) {
        toast.error("Please upload a PDF, Word document, or text file");
        return;
      }
      if (file.size > tenMB) {
        toast.error("Files size must be less than 10MB");
        return;
      }
    }
    setDocuments(files);
  };

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    if (documents.length === 0) {
      toast.error("Please upload at least one file to start conversation!");
      setIsLoading(false);
      return;
    }

      try {
       const conversation = await createNewConversation(values.conversationName,user.id);
       if(!conversation || !conversation.id) {
           throw new Error("Error in uploading files");
       }

       setShowLoader(true);

       const uploadedFiles = documents.map(async (doc : File) => {
              return await uploadFile(doc, user.id, conversation.id);
       });

       console.log("uploaded Files",uploadedFiles);

       const uploadedFilesData = await Promise.all(uploadedFiles);
       const insertedDocs = await insertFiles(conversation.id,uploadedFilesData);

       const chunks = await embedFile(insertedDocs);

       router.push(`/chat/c/${conversation.id}`);

       // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }catch (e : any) {
        toast.error(e.message);
        console.log(e);

    }finally {
        setIsLoading(false);
        setShowLoader(false);
      }
  };
  return (
    <Form {...form}>
        <MultiStepLoader
            loadingStates={loadingStates}
            loading={showLoader}
            duration={2000}
            loop={false}
        />
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="conversationName"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Conversation Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. MongoDB document" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="border rounded-md p-4">
          <div className="group h-[20em] rounded-md border border-dashed">
            <FileUpload
              onChange={handleFilesUpload}
              content="Drag or drop your documents here or click to upload"
            />
          </div>
          {documents.length > 0 && (
            <SelectedDocumentsList documents={documents} />
          )}
        </div>
        <Button
          type="submit"
          variant={"default"}
          className="w-full"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <Icons.spinner className="size-4 animate-spin" />
              <span>Processing...</span>
            </div>
          ) : (
            "Upload and Start Chat"
          )}
        </Button>
      </form>
    </Form>
  );
};

const SelectedDocumentsList = ({ documents }: { documents: File[] }) => (
  <div className="mt-4 p-4 bg-muted rounded-md">
    <p className="text-sm font-medium">Selected documents:</p>
    <ul className="text-sm">
      {documents.map((file, idx) => (
        <li key={idx}>
          {file.name}{" "}
          <span className="text-xs text-muted-foreground">
            ({(file.size / (1024 * 1024)).toFixed(2)} MB)
          </span>
        </li>
      ))}
    </ul>
  </div>
);
