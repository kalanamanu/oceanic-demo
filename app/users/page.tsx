import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function UserPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Users</h1>
            <p className="text-muted-foreground mt-1">
              Manage and view all users
            </p>
          </div>
          <Link href="/quotation/create">
            <Button>Create User</Button>
          </Link>
        </div>

        <div className="rounded-xl border bg-card p-12 text-center">
          <p className="text-muted-foreground">
            🚧 This page is under development
          </p>
        </div>
      </main>
    </div>
  );
}
