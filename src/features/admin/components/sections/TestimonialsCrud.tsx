"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Testimonial } from "@/types/portfolio";
import { testimonialSchema, TestimonialInput } from "../../types/adminTypes";
import { upsertTestimonial, deleteTestimonial } from "../../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";
import { Dialog } from "@/components/ui/dialog";
import { ConfirmDialog } from "../ConfirmDialog";
import { Search } from "../Search";
import { Pagination } from "../Pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, CheckCircle2, AlertCircle } from "lucide-react";

interface TestimonialsCrudProps {
  testimonials: Testimonial[];
}

export function TestimonialsCrud({ testimonials }: TestimonialsCrudProps) {
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingTest, setEditingTest] = React.useState<Testimonial | null>(null);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [status, setStatus] = React.useState<{ success: boolean; message?: string } | null>(null);

  // Search & Pagination states
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const itemsPerPage = 5;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<TestimonialInput>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: { name: "", role: "", company: "", image: "", text: "", rating: 5 }
  });

  React.useEffect(() => {
    setPage(1);
  }, [search]);

  const handleOpenAdd = () => {
    setEditingTest(null);
    reset({ id: "", name: "", role: "", company: "", image: "", text: "", rating: 5 });
    setStatus(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (test: Testimonial) => {
    setEditingTest(test);
    reset({
      id: test.id,
      name: test.name,
      role: test.role,
      company: test.company,
      image: test.image,
      text: test.text,
      rating: test.rating,
    });
    setStatus(null);
    setIsFormOpen(true);
  };

  const onSubmit: SubmitHandler<TestimonialInput> = async (data) => {
    setIsSubmitting(true);
    setStatus(null);
    try {
      const response = await upsertTestimonial(data);
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
      await deleteTestimonial(deletingId);
    } catch (err) {
      alert("Failed to delete testimonial.");
    } finally {
      setDeletingId(null);
    }
  };

  // Live filter and pagination slicing
  const filteredTestimonials = testimonials.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.company.toLowerCase().includes(search.toLowerCase()) ||
      t.text.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTestimonials.length / itemsPerPage);
  const paginatedTestimonials = filteredTestimonials.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Search value={search} onChange={setSearch} placeholder="Search client reviews by client or company..." />
        <Button onClick={handleOpenAdd} size="sm" className="cursor-pointer self-stretch sm:self-auto">
          <Plus className="h-4 w-4" />
          Add Testimonial
        </Button>
      </div>

      <div className="border border-border/60 bg-muted/10 rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border/40 hover:bg-transparent">
              <TableHead className="font-semibold text-muted-foreground">Name</TableHead>
              <TableHead className="font-semibold text-muted-foreground">Company</TableHead>
              <TableHead className="font-semibold text-muted-foreground">Rating</TableHead>
              <TableHead className="font-semibold text-muted-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTestimonials.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="p-8 text-center text-sm text-muted-foreground">
                  No testimonials found matching filters.
                </TableCell>
              </TableRow>
            ) : (
              paginatedTestimonials.map((test) => (
                <TableRow key={test.id} className="border-b border-border/40 hover:bg-muted/10">
                  <TableCell className="font-bold text-foreground py-3.5">{test.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground py-3.5">{test.company}</TableCell>
                  <TableCell className="text-sm text-amber-500 font-bold py-3.5">{"★".repeat(test.rating)}</TableCell>
                  <TableCell className="py-3.5 text-right space-x-1.5">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(test)} className="h-8 w-8 cursor-pointer">
                      <Edit className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeletingId(test.id)} className="h-8 w-8 cursor-pointer">
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
        title={editingTest ? "Edit Testimonial" : "Add Testimonial"}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Client Name" id="name" error={errors.name?.message}>
              <Input id="name" placeholder="Sarah Jenkins" {...register("name")} />
            </FormField>

            <FormField label="Avatar Image URL" id="image" error={errors.image?.message}>
              <Input id="image" placeholder="https://..." {...register("image")} />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Role / Position" id="role" error={errors.role?.message}>
              <Input id="role" placeholder="Engineering Director" {...register("role")} />
            </FormField>

            <FormField label="Company Name" id="company" error={errors.company?.message}>
              <Input id="company" placeholder="TechCorp" {...register("company")} />
            </FormField>
          </div>

          <FormField label="Review Quote" id="text" error={errors.text?.message}>
            <Textarea id="text" placeholder="Sarah's comments..." rows={4} {...register("text")} />
          </FormField>

          <FormField label="Rating (1-5 Stars)" id="rating" error={errors.rating?.message}>
            <select
              id="rating"
              {...register("rating", { valueAsNumber: true })}
              className="flex h-10 w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </FormField>

          <div className="flex justify-end gap-3 pt-3 border-t border-border/20">
            <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)} className="cursor-pointer">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
              {isSubmitting ? "Saving..." : "Save Testimonial"}
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Confirm Deletion */}
      <ConfirmDialog
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Testimonial?"
        message="Are you sure you want to remove this client testimonial card?"
      />
    </div>
  );
}
