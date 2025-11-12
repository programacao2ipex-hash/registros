import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
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
  const getLocalDateString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getLocalTimeString = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const [formData, setFormData] = useState({
    company: "",
    companyOther: "",
    subject: "",
    subjectOther: "",
    requestedBy: [] as string[],
    requestedByOther: "",
    documentType: "",
    onlinePlatform: "",
    signedBy: [] as string[],
    signedByOther: "",
    signatureDate: getLocalDateString(),
    signatureTime: getLocalTimeString(),
    responsible: "",
    responsibleOther: "",
  });

  const createMutation = trpc.documentRecords.create.useMutation({
    onSuccess: () => {
      toast.success("Registro criado com sucesso!");
      setFormData({
        company: "",
        companyOther: "",
        subject: "",
        subjectOther: "",
        requestedBy: [],
        requestedByOther: "",
        documentType: "",
        onlinePlatform: "",
        signedBy: [],
        signedByOther: "",
        signatureDate: getLocalDateString(),
        signatureTime: getLocalTimeString(),
        responsible: "",
        responsibleOther: "",
      });
    },
    onError: (error) => {
      toast.error("Erro ao criar registro: " + error.message);
    },
  });

  const handleRequestedByChange = (option: string) => {
    setFormData(prev => ({
      ...prev,
      requestedBy: prev.requestedBy.includes(option)
        ? prev.requestedBy.filter(item => item !== option)
        : [...prev.requestedBy, option]
    }));
  };

  const handleSignedByChange = (option: string) => {
    setFormData(prev => ({
      ...prev,
      signedBy: prev.signedBy.includes(option)
        ? prev.signedBy.filter(item => item !== option)
        : [...prev.signedBy, option]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
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
    if (formData.requestedBy.length === 0) {
      toast.error("Selecione pelo menos uma pessoa que solicitou");
      return;
    }
    if (formData.requestedBy.includes("OUTRO") && !formData.requestedByOther) {
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
    if (formData.signedBy.length === 0) {
      toast.error("Selecione pelo menos uma pessoa que assinou");
      return;
    }
    if (formData.signedBy.includes("OUTRO") && !formData.signedByOther) {
      toast.error("Digite o nome de quem assinou");
      return;
    }
    if (!formData.signatureDate) {
      toast.error("Selecione a data");
      return;
    }
    if (!formData.signatureTime) {
      toast.error("Selecione a hora");
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

    const requestedByValue = formData.requestedBy.join(", ");
    const signedByValue = formData.signedBy.join(", ");

    // Combine date and time properly
    const [year, month, day] = formData.signatureDate.split('-');
    const [hours, minutes] = formData.signatureTime.split(':');
    const signatureDatetime = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hours),
      parseInt(minutes),
      0,
      0
    );

    createMutation.mutate({
      company: formData.company,
      companyOther: formData.company === "OUTRO" ? formData.companyOther : undefined,
      subject: formData.subject,
      subjectOther: formData.subject === "OUTRO" ? formData.subjectOther : undefined,
      requestedBy: requestedByValue,
      requestedByOther: formData.requestedBy.includes("OUTRO") ? formData.requestedByOther : undefined,
      documentType: formData.documentType as "PDF" | "ONLINE",
      onlinePlatform: formData.documentType === "ONLINE" ? formData.onlinePlatform : undefined,
      signedBy: signedByValue,
      signedByOther: formData.signedBy.includes("OUTRO") ? formData.signedByOther : undefined,
      signatureDate: signatureDatetime,
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

              <div className="space-y-3">
                <Label>Solicitado por (múltipla seleção)</Label>
                <div className="space-y-2 border rounded-lg p-3">
                  {REQUESTED_BY_OPTIONS.map(option => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={`requestedBy-${option}`}
                        checked={formData.requestedBy.includes(option)}
                        onCheckedChange={() => handleRequestedByChange(option)}
                      />
                      <Label htmlFor={`requestedBy-${option}`} className="font-normal cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
                {formData.requestedBy.includes("OUTRO") && (
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

              <div className="space-y-3">
                <Label>Assinatura de (múltipla seleção)</Label>
                <div className="space-y-2 border rounded-lg p-3">
                  {SIGNED_BY_OPTIONS.map(option => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={`signedBy-${option}`}
                        checked={formData.signedBy.includes(option)}
                        onCheckedChange={() => handleSignedByChange(option)}
                      />
                      <Label htmlFor={`signedBy-${option}`} className="font-normal cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
                {formData.signedBy.includes("OUTRO") && (
                  <Input
                    placeholder="Digite o nome"
                    value={formData.signedByOther}
                    onChange={(e) => setFormData({ ...formData, signedByOther: e.target.value })}
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signatureDate">Data e Hora</Label>
                <div className="flex gap-2">
                  <Input
                    id="signatureDate"
                    type="date"
                    value={formData.signatureDate}
                    onChange={(e) => setFormData({ ...formData, signatureDate: e.target.value })}
                    className="flex-1"
                  />
                  <Input
                    id="signatureTime"
                    type="time"
                    value={formData.signatureTime}
                    onChange={(e) => setFormData({ ...formData, signatureTime: e.target.value })}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setFormData({ 
                        ...formData, 
                        signatureDate: getLocalDateString(),
                        signatureTime: getLocalTimeString()
                      });
                    }}
                  >
                    Agora
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
