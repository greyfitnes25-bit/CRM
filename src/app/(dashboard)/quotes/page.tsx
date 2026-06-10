import { Construction } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full">
        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
          <div className="p-4 rounded-full bg-muted">
            <Construction className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">En construcción</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Esta sección estará disponible próximamente. El dashboard principal ya está funcionando.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
