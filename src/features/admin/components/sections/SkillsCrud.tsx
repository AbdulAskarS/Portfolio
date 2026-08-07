"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Skill } from "@/types/portfolio";
import { skillSchema, SkillInput } from "../../types/adminTypes";
import { upsertSkill, deleteSkill } from "../../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Dialog } from "@/components/ui/dialog";
import { ConfirmDialog } from "../ConfirmDialog";
import { Search } from "../Search";
import { Pagination } from "../Pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import * as LucideIcons from "lucide-react";

interface SkillsCrudProps {
  skills: Skill[];
}

export function SkillsCrud({ skills }: SkillsCrudProps) {
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingSkill, setEditingSkill] = React.useState<Skill | null>(null);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [status, setStatus] = React.useState<{ success: boolean; message?: string } | null>(null);

  // Search & Pagination states
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const itemsPerPage = 8;

  const popularIcons = [
    "Code", "Database", "Terminal", "Cpu", "Globe", "Server", "Smartphone", 
    "Layout", "Settings", "Layers", "Lock", "Cloud", "Braces", "Activity", 
    "Briefcase", "CheckSquare", "Monitor", "Workflow"
  ];

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<SkillInput>({
    resolver: zodResolver(skillSchema),
    defaultValues: { name: "", category: "Frontend", level: 90, icon: "Code" }
  });

  const selectedIcon = watch("icon") || "Code";

  React.useEffect(() => {
    setPage(1);
  }, [search]);

  const handleOpenAdd = () => {
    setEditingSkill(null);
    reset({ id: "", name: "", category: "Frontend", level: 90, icon: "Code" });
    setStatus(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (skill: Skill) => {
    setEditingSkill(skill);
    reset({
      id: skill.id,
      name: skill.name,
      category: skill.category,
      level: skill.level,
      icon: skill.icon,
    });
    setStatus(null);
    setIsFormOpen(true);
  };

  const onSubmit: SubmitHandler<SkillInput> = async (data) => {
    setIsSubmitting(true);
    setStatus(null);
    try {
      const response = await upsertSkill(data);
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
      await deleteSkill(deletingId);
    } catch (err) {
      alert("Failed to delete skill.");
    } finally {
      setDeletingId(null);
    }
  };

  // Live filter and pagination slicing
  const filteredSkills = skills.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSkills.length / itemsPerPage);
  const paginatedSkills = filteredSkills.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // Dynamic Lucide icon renderer utility
  const renderLucideIcon = (name: string, className?: string) => {
    const IconComponent = (LucideIcons as any)[name];
    if (IconComponent) {
      return <IconComponent className={className} aria-hidden="true" />;
    }
    return <LucideIcons.HelpCircle className={className} aria-hidden="true" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Search value={search} onChange={setSearch} placeholder="Search skills by name or category..." />
        <Button onClick={handleOpenAdd} size="sm" className="cursor-pointer self-stretch sm:self-auto">
          <Plus className="h-4 w-4" />
          Add Skill
        </Button>
      </div>

      <div className="border border-border/60 bg-muted/10 rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border/40 hover:bg-transparent">
              <TableHead className="font-semibold text-muted-foreground w-12 text-center">Icon</TableHead>
              <TableHead className="font-semibold text-muted-foreground">Name</TableHead>
              <TableHead className="font-semibold text-muted-foreground">Category</TableHead>
              <TableHead className="font-semibold text-muted-foreground">Expertise Level</TableHead>
              <TableHead className="font-semibold text-muted-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedSkills.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="p-8 text-center text-sm text-muted-foreground">
                  No skills found matching filters.
                </TableCell>
              </TableRow>
            ) : (
              paginatedSkills.map((skill) => (
                <TableRow key={skill.id} className="border-b border-border/40 hover:bg-muted/10">
                  <TableCell className="py-3.5 text-center">
                    <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      {renderLucideIcon(skill.icon, "h-4.5 w-4.5")}
                    </div>
                  </TableCell>
                  <TableCell className="font-bold text-foreground py-3.5">{skill.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground py-3.5">{skill.category}</TableCell>
                  <TableCell className="py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-32 bg-muted rounded-full overflow-hidden" aria-hidden="true">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${skill.level}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-foreground">{skill.level}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3.5 text-right space-x-1.5">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(skill)} className="h-8 w-8 cursor-pointer">
                      <Edit className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeletingId(skill.id)} className="h-8 w-8 cursor-pointer">
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
        title={editingSkill ? "Edit Skill" : "Add Skill"}
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

          <FormField label="Skill Name" id="name" error={errors.name?.message}>
            <Input id="name" placeholder="React" {...register("name")} />
          </FormField>

          <FormField label="Category" id="category" error={errors.category?.message}>
            <select
              id="category"
              {...register("category")}
              className="flex h-10 w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="DevOps">DevOps</option>
              <option value="Tools">Tools</option>
              <option value="Languages">Languages</option>
            </select>
          </FormField>

          <FormField label="Expertise Level (0-100)" id="level" error={errors.level?.message}>
            <Input id="level" type="number" min={0} max={100} {...register("level", { valueAsNumber: true })} />
          </FormField>

          {/* Lucide icon grid selector */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-muted-foreground">Select Icon badge</span>
            <div className="grid grid-cols-6 gap-2 p-3.5 border border-border/40 bg-muted/5 rounded-lg max-h-[140px] overflow-y-auto">
              {popularIcons.map((name) => {
                const isSelected = selectedIcon.toLowerCase() === name.toLowerCase();
                return (
                  <button
                    key={name}
                    type="button"
                    title={name}
                    onClick={() => setValue("icon", name)}
                    className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-primary border-primary text-primary-foreground shadow"
                        : "border-border/30 hover:border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {renderLucideIcon(name, "h-4.5 w-4.5")}
                  </button>
                );
              })}
            </div>
            {errors.icon?.message && (
              <p className="text-[11px] font-medium text-destructive">{errors.icon.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-border/20">
            <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)} className="cursor-pointer">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
              {isSubmitting ? "Saving..." : "Save Skill"}
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Confirm Deletion */}
      <ConfirmDialog
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Skill?"
        message="Are you sure you want to remove this skill from your expertise listing?"
      />
    </div>
  );
}
