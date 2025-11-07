import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { APP_LOGO, getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Download, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Registros() {
  const { user, loading, isAuthenticated } = useAuth();
  const { data: records, isLoading: recordsLoading } = trpc.documentRecords.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const exportCSVMutation = trpc.documentRecords.exportCSV.useQuery(undefined, {
    enabled: false,
  });

  const handleExportCSV = async () => {
    try {
      const result = await exportCSVMutation.refetch();
      if (result.data) {
        const blob = new Blob([result.data.content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `registros_documentos_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("CSV exportado com sucesso!");
      }
    } catch (error) {
      toast.error("Erro ao exportar CSV");
    }
  };

  const handleExportPDF = () => {
    if (!records || records.length === 0) {
      toast.error("Nenhum registro para exportar");
      return;
    }

    try {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(16);
      doc.text("Registro de Documentos Assinados - IPEX", 14, 15);
      doc.setFontSize(10);
      doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 22);
      
      // Prepare table data
      const tableData = records.map(record => {
        const requestedBy = record.requestedBy === "OUTRO" ? record.requestedByOther : record.requestedBy;
        const signedBy = record.signedBy === "OUTRO" ? record.signedByOther : record.signedBy;
        const responsible = record.responsible === "OUTRO" ? record.responsibleOther : record.responsible;
        const platform = record.documentType === "ONLINE" ? record.onlinePlatform : "N/A";
        
        return [
          record.id,
          requestedBy,
          record.documentType,
          platform,
          signedBy,
          new Date(record.signatureDate).toLocaleDateString('pt-BR'),
          responsible,
          new Date(record.createdAt).toLocaleDateString('pt-BR')
        ];
      });
      
      // Add table
      autoTable(doc, {
        startY: 28,
        head: [[
          "ID",
          "Solicitado Por",
          "Tipo",
          "Plataforma",
          "Assinado Por",
          "Data",
          "Respons\u00e1vel",
          "Criado em"
        ]],
        body: tableData,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [193, 210, 60] },
      });
      
      doc.save(`registros_documentos_${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success("PDF exportado com sucesso!");
    } catch (error) {
      toast.error("Erro ao exportar PDF");
    }
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
              <a href="/">Novo Registro</a>
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-6 h-6 text-primary" />
                <div>
                  <CardTitle>Registros de Documentos</CardTitle>
                  <CardDescription>Lista de todos os documentos assinados</CardDescription>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleExportCSV} disabled={exportCSVMutation.isFetching}>
                  {exportCSVMutation.isFetching ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  Exportar CSV
                </Button>
                <Button variant="outline" onClick={handleExportPDF}>
                  <Download className="w-4 h-4 mr-2" />
                  Exportar PDF
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {recordsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : !records || records.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum registro encontrado</p>
                <Button asChild className="mt-4">
                  <a href="/">Criar Primeiro Registro</a>
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Solicitado Por</TableHead>
                      <TableHead>Tipo Documento</TableHead>
                      <TableHead>Plataforma</TableHead>
                      <TableHead>Assinatura de</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Responsável</TableHead>
                      <TableHead>Criado em</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {records.map((record) => {
                      const requestedBy = record.requestedBy === "OUTRO" ? record.requestedByOther : record.requestedBy;
                      const signedBy = record.signedBy === "OUTRO" ? record.signedByOther : record.signedBy;
                      const responsible = record.responsible === "OUTRO" ? record.responsibleOther : record.responsible;
                      const platform = record.documentType === "ONLINE" ? record.onlinePlatform : "N/A";
                      
                      return (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">{record.id}</TableCell>
                          <TableCell>{requestedBy}</TableCell>
                          <TableCell>{record.documentType}</TableCell>
                          <TableCell>{platform}</TableCell>
                          <TableCell>{signedBy}</TableCell>
                          <TableCell>{new Date(record.signatureDate).toLocaleDateString('pt-BR')}</TableCell>
                          <TableCell>{responsible}</TableCell>
                          <TableCell>{new Date(record.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
