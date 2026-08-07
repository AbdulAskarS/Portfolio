"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Certificate } from "@/types/portfolio";
import { certificateSchema, CertificateInput } from "../../types/adminTypes";
import { upsertCertificate, deleteCertificate } from "../../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Dialog } from "@/components/ui/dialog";
import { ConfirmDialog } from "../ConfirmDialog";
import { Search } from "../Search";
import { Pagination } from "../Pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, CheckCircle2, AlertCircle } from "lucide-react";

interface CertificatesCrudProps {
  certificates: Certificate[];
}

export function CertificatesCrud({ certificates }: CertificatesCrudProps) {
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingCert, setEditingCert] = React.useState<Certificate | null>(null);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [status, setStatus] = React.useState<{ success: boolean; message?: string } | null>(null);

  // Search & Pagination states
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const itemsPerPage = 5;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CertificateInput>({
    resolver: zodResolver(certificateSchema),
    defaultValues: { name: "", issuer: "", issueDate: "", expiryDate: "", credentialId: "", credentialUrl: "", image: "" }
  });

  React.useEffect(() => {
    setPage(1);
  }, [search]);

  const handleOpenAdd = () => {
    setEditingCert(null);
    reset({ id: "", name: "", issuer: "", issueDate: "", expiryDate: "", credentialId: "", credentialUrl: "", image: "" });
    setStatus(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (cert: Certificate) => {
    setEditingCert(cert);
    reset({
      id: cert.id,
      name: cert.name,
      issuer: cert.issuer,
      issueDate: cert.issueDate,
      expiryDate: cert.expiryDate || "",
      credentialId: cert.credentialId || "",
      credentialUrl: cert.credentialUrl || "",
      image: cert.image,
    });
    setStatus(null);
    setIsFormOpen(true);
  };

  const onSubmit: SubmitHandler<CertificateInput> = async (data) => {
    setIsSubmitting(true);
    setStatus(null);
    try {
      const response = await upsertCertificate(data);
      setStatus(response);
      if (response.success) {
        setIsFormOpen(false);
        reset();
      }
    } catch (err) {
      setStatus({ success: false, message: "A network error occurred." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteCertificate(deletingId);
    } catch (err) {
      alert("Failed to delete certificate.");
    } finally {
      setDeletingId(null);
    }
  };

  // Live filter and pagination slicing
  const filteredCertificates = certificates.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.issuer.toLowerCase().includes(search.toLowerCase()) ||
      (c.credentialId || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCertificates.length / itemsPerPage);
  const paginatedCertificates = filteredCertificates.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Search value={search} onChange={setSearch} placeholder="Search credentials by name, issuer..." />
        <Button onClick={handleOpenAdd} size="sm" className="cursor-pointer self-stretch sm:self-auto">
          <Plus className="h-4 w-4" />
          Add Certificate
        </Button>
      </div>

      <div className="border border-border/60 bg-muted/10 rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border/40 hover:bg-transparent">
              <TableHead className="font-semibold text-muted-foreground">Name</TableHead>
              <TableHead className="font-semibold text-muted-foreground">Issuer</TableHead>
              <TableHead className="font-semibold text-muted-foreground">Date Issued</TableHead>
              <TableHead className="font-semibold text-muted-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCertificates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="p-8 text-center text-sm text-muted-foreground">
                  No certifications found matching filters.
                </TableCell>
              </TableRow>
            ) : (
              paginatedCertificates.map((cert) => (
                <TableRow key={cert.id} className="border-b border-border/40 hover:bg-muted/10">
                  <TableCell className="font-bold text-foreground py-3.5">{cert.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground py-3.5">{cert.issuer}</TableCell>
                  <TableCell className="text-sm text-muted-foreground py-3.5">{cert.issueDate}</TableCell>
                  <TableCell className="py-3.5 text-right space-x-1.5">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(cert)} className="h-8 w-8 cursor-pointer">
                      <Edit className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeletingId(cert.id)} className="h-8 w-8 cursor-pointer">
                      <Trash2 className="h-3.5 w-3.5 text-destructive hover:text-destructive/80" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

      {/* Editor Modal */}
      <Dialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingCert ? "Edit Certification" : "Add Certification"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
          {status && (
            <div
              className={`flex items-start gap-2.5 p-4 rounded-lg text-sm border ${
                status.success
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500 dark:text-emerald-400"
                  : "bg-destructive/10 border-destructive/30 text-destructive"
              }`}
            >
              {status.success ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
              ) : (
                <AlertCircle className="h-5 w-5 shrink-0 text-destructive" />
              )}
              <span>{status.message}</span>
            </div>
          )}

          <input type="hidden" {...register("id")} />

          <FormField label="Certification Name" id="name" error={errors.name?.message}>
            <Input id="name" placeholder="AWS Solutions Architect" {...register("name")} />
          </FormField>

          <FormField label="Issuer" id="issuer" error={errors.issuer?.message}>
            <Input id="issuer" placeholder="Amazon Web Services" {...register("issuer")} />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Issue Date (YYYY-MM)" id="issueDate" error={errors.issueDate?.message}>
              <Input id="issueDate" placeholder="2025-09" {...register("issueDate")} />
            </FormField>

            <FormField label="Expiry Date (Optional)" id="expiryDate" error={errors.expiryDate?.message}>
              <Input id="expiryDate" placeholder="2028-09" {...register("expiryDate")} />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Credential ID (Optional)" id="credentialId" error={errors.credentialId?.message}>
              <Input id="credentialId" placeholder="AWS-ASA-92384" {...register("credentialId")} />
            </FormField>

            <FormField label="Credential URL (Optional)" id="credentialUrl" error={errors.credentialUrl?.message}>
              <Input id="credentialUrl" placeholder="https://..." {...register("credentialUrl")} />
            </FormField>
          </div>

          <FormField label="Certificate Badge/Logo URL" id="image" error={errors.image?.message}>
            <Input id="image" placeholder="https://..." {...register("image")} />
          </FormField>

          <div className="flex justify-end gap-3 pt-3 border-t border-border/20">
            <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)} className="cursor-pointer">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
              {isSubmitting ? "Saving..." : "Save Certificate"}
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Confirm Deletion */}
      <ConfirmDialog
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Certification?"
        message="Are you sure you want to remove this certificate credential?"
      />
    </div>
  );
}
