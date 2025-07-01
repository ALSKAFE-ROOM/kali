import { Switch, Route, Link } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Login from "@/pages/login";
import AdminPage from "@/pages/admin";

// Header component with admin button
function Header() {
  return (
    <header className="bg-white shadow-sm p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">تقويم حجز الشاليه</h1>
        <div className="flex gap-2">
          <Link href="/">
            <Button variant="ghost" size="sm">الرئيسية</Button>
          </Link>
          <Link href="/admin">
            <Button variant="outline" size="sm">إدارة</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

function Router() {
  return (
    <>
      <Header />
      <main className="container mx-auto py-4">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/admin" component={AdminPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
