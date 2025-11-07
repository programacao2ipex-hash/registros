import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { FileText, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const COMPANY_OPTIONS = ["IPEX CONSTRUTORA", "NEW YORK LOFTS", "MANHATTAN LOFTS", "CARPE DIEM RESIDENCIAL", "GREEN TOWER", "IPEX AGRONEGOCIOS", "OUTRO"];
const SUBJECT_OPTIONS = ["CONTRATO VENDA", "CONTRATO FORNECEDOR", "RECEBÍVEL", "OUTRO"];
const REQUESTED_BY_OPTIONS = ["RAMON", "JESSICA", "LADY", "EMANUEL", "LED MARLON", "LEANDRO", "MATHEUS", "EDUARDO", "OUTRO"];
const SIGNED_BY_OPTIONS = ["EMANUEL", "PAULO", "LEONILDA", "OUTRO"];
const RESPONSIBLE_OPTIONS = ["RICARDO", "OUTRO"];
const DOCUMENT_TYPES = ["PDF", "ONLINE"];

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    company: "",
    companyOther: "",
    subject: "",
    subjectOther: "",
    requestedBy: "",
    requestedByOther: "",
    documentType: "",
    onlinePlatform: "",
    signedBy: "",
    signedByOther: "",
    signatureDate: new Date().toISOString().split('T')[0],
    responsible: "",
    responsibleOther: "",
  });

  const createMutation = trpc.documentRecords.create.useMutation({
    onSuccess: () => {
      toast.success("Registro criado com sucesso!");
      // Reset form
      setFormData({
        company: "",
        companyOther: "",
        subject: "",
        subjectOther: "",
        requestedBy: "",
        requestedByOther: "",
        documentType: "",
        onlinePlatform: "",
        signedBy: "",
        signedByOther: "",
        signatureDate: new Date().toISOString().split('T')[0],
        responsible: "",
        responsibleOther: "",
      });
    },
    onError: (error) => {
      toast.error("Erro ao criar registro: " + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.company) {
      toast.error("Selecione a empresa");
      return;
    }
    if (formData.company === "OUTRO" && !formData.companyOther) {
      toast.error("Digite o nome da empresa");
      return;
    }
    if (!formData.subject) {
      toast.error("Selecione o assunto");
      return;
    }
    if (formData.subject === "OUTRO" && !formData.subjectOther) {
      toast.error("Digite o assunto");
      return;
    }
    if (!formData.requestedBy) {
      toast.error("Selecione quem solicitou");
      return;
    }
    if (formData.requestedBy === "OUTRO" && !formData.requestedByOther) {
      toast.error("Digite o nome de quem solicitou");
      return;
    }
    if (!formData.documentType) {
      toast.error("Selecione o tipo de documento");
      return;
    }
    if (formData.documentType === "ONLINE" && !formData.onlinePlatform) {
      toast.error("Digite a plataforma online");
      return;
    }
    if (!formData.signedBy) {
      toast.error("Selecione quem assinou");
      return;
    }
    if (formData.signedBy === "OUTRO" && !formData.signedByOther) {
      toast.error("Digite o nome de quem assinou");
      return;
    }
    if (!formData.signatureDate) {
      toast.error("Selecione a data");
      return;
    }
    if (!formData.responsible) {
      toast.error("Selecione o responsável");
      return;
    }
    if (formData.responsible === "OUTRO" && !formData.responsibleOther) {
      toast.error("Digite o nome do responsável");
      return;
    }

    createMutation.mutate({
      company: formData.company,
      companyOther: formData.company === "OUTRO" ? formData.companyOther : undefined,
      subject: formData.subject,
      subjectOther: formData.subject === "OUTRO" ? formData.subjectOther : undefined,
      requestedBy: formData.requestedBy,
      requestedByOther: formData.requestedBy === "OUTRO" ? formData.requestedByOther : undefined,
      documentType: formData.documentType as "PDF" | "ONLINE",
      onlinePlatform: formData.documentType === "ONLINE" ? formData.onlinePlatform : undefined,
      signedBy: formData.signedBy,
      signedByOther: formData.signedBy === "OUTRO" ? formData.signedByOther : undefined,
      signatureDate: new Date(formData.signatureDate),
      responsible: formData.responsible,
      responsibleOther: formData.responsible === "OUTRO" ? formData.responsibleOther : undefined,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <img src={APP_LOGO} alt="IPEX Logo" className="w-32 mx-auto mb-4" />
            <CardTitle>Registro de Documentos Assinados</CardTitle>
            <CardDescription>Faça login para acessar o sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <a href={getLoginUrl()}>Fazer Login</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={APP_LOGO} alt="IPEX Logo" className="h-10" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Registro de Documentos Assinados</h1>
              <p className="text-sm text-muted-foreground">IPEX Construtora</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Olá, {user?.name}</span>
            <Button variant="outline" size="sm" asChild>
              <a href="/registros">Ver Registros</a>
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-primary" />
              <CardTitle>Novo Registro</CardTitle>
            </div>
            <CardDescription>Preencha os dados do documento assinado</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="company">Empresa</Label>
                <Select value={formData.company} onValueChange={(value) => setFormData({ ...formData, company: value })}>
                  <SelectTrigger id="company">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {COMPANY_OPTIONS.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.company === "OUTRO" && (
                  <Input
                    placeholder="Digite o nome da empresa"
                    value={formData.companyOther}
                    onChange={(e) => setFormData({ ...formData, companyOther: e.target.value })}
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Assunto</Label>
                <Select value={formData.subject} onValueChange={(value) => setFormData({ ...formData, subject: value })}>
                  <SelectTrigger id="subject">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBJECT_OPTIONS.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.subject === "OUTRO" && (
                  <Input
                    placeholder="Digite o assunto"
                    value={formData.subjectOther}
                    onChange={(e) => setFormData({ ...formData, subjectOther: e.target.value })}
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="requestedBy">Solicitado por</Label>
                <Select value={formData.requestedBy} onValueChange={(value) => setFormData({ ...formData, requestedBy: value })}>
                  <SelectTrigger id="requestedBy">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {REQUESTED_BY_OPTIONS.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.requestedBy === "OUTRO" && (
                  <Input
                    placeholder="Digite o nome"
                    value={formData.requestedByOther}
                    onChange={(e) => setFormData({ ...formData, requestedByOther: e.target.value })}
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="documentType">Tipo de Documento</Label>
                <Select value={formData.documentType} onValueChange={(value) => setFormData({ ...formData, documentType: value })}>
                  <SelectTrigger id="documentType">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {DOCUMENT_TYPES.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.documentType === "ONLINE" && (
                  <Input
                    placeholder="Digite a plataforma"
                    value={formData.onlinePlatform}
                    onChange={(e) => setFormData({ ...formData, onlinePlatform: e.target.value })}
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signedBy">Assinatura de</Label>
                <Select value={formData.signedBy} onValueChange={(value) => setFormData({ ...formData, signedBy: value })}>
                  <SelectTrigger id="signedBy">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {SIGNED_BY_OPTIONS.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.signedBy === "OUTRO" && (
                  <Input
                    placeholder="Digite o nome"
                    value={formData.signedByOther}
                    onChange={(e) => setFormData({ ...formData, signedByOther: e.target.value })}
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signatureDate">Data</Label>
                <div className="flex gap-2">
                  <Input
                    id="signatureDate"
                    type="date"
                    value={formData.signatureDate}
                    onChange={(e) => setFormData({ ...formData, signatureDate: e.target.value })}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setFormData({ ...formData, signatureDate: new Date().toISOString().split('T')[0] })}
                  >
                    Hoje
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="responsible">Responsável</Label>
                <Select value={formData.responsible} onValueChange={(value) => setFormData({ ...formData, responsible: value })}>
                  <SelectTrigger id="responsible">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {RESPONSIBLE_OPTIONS.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.responsible === "OUTRO" && (
                  <Input
                    placeholder="Digite o nome"
                    value={formData.responsibleOther}
                    onChange={(e) => setFormData({ ...formData, responsibleOther: e.target.value })}
                  />
                )}
              </div>

              <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar Registro"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
