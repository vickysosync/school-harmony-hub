"use client";

import { useState } from "react";
import {
  Building2,
  Database,
  Download,
  KeyRound,
  Plus,
  RotateCcw,
  Save,
  Shield,
  Trash2,
  Upload,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/context/AppContext";
import { storage } from "@/services/storage";
import {
  EmptyState,
  FormModal,
  PageHeader,
  Panel,
  SelectField,
  TextField,
  useConfirm,
} from "@/components/common/Ui";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/common/DataTable";
import { Badge } from "@/modules/shared";

export function SchoolProfile() {
  const { settings, saveSettings } = useApp();
  const [form, setForm] = useState({ ...settings });

  const setField = (k: string, v: string) => setForm((prev: any) => ({ ...prev, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings(form);
    toast.success("School profile updated successfully!");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="School Profile & Settings"
        subtitle="Configure institution identity, letterhead headers, session, and affiliations."
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <Panel
          title="Basic Information"
          actions={
            <Button type="submit" size="sm" className="gap-2">
              <Save className="size-4" /> Save Changes
            </Button>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <TextField
              label="School Name"
              value={form.name}
              onChange={(v) => setField("name", v)}
              required
            />
            <TextField
              label="Tagline / Motto"
              value={form.tagline}
              onChange={(v) => setField("tagline", v)}
            />
            <TextField
              label="School Code"
              value={form.code}
              onChange={(v) => setField("code", v)}
              required
            />
            <TextField
              label="Affiliation Details"
              value={form.affiliation}
              onChange={(v) => setField("affiliation", v)}
            />
            <TextField
              label="Principal Name"
              value={form.principal}
              onChange={(v) => setField("principal", v)}
            />
            <TextField
              label="Current Academic Session"
              value={form.session}
              onChange={(v) => setField("session", v)}
            />
          </div>
        </Panel>

        <Panel title="Contact & Address (Used in Letterhead and Receipts)">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="sm:col-span-2 lg:col-span-3">
              <TextField
                label="Full Address"
                value={form.address}
                onChange={(v) => setField("address", v)}
              />
            </div>
            <TextField
              label="Phone Number"
              value={form.phone}
              onChange={(v) => setField("phone", v)}
            />
            <TextField
              label="Email Address"
              value={form.email}
              onChange={(v) => setField("email", v)}
              type="email"
            />
            <TextField
              label="Official Website"
              value={form.website}
              onChange={(v) => setField("website", v)}
            />
          </div>
        </Panel>

        <Panel title="Branding & Logo URL">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Logo Image URL"
              value={form.logo}
              placeholder="https://example.com/logo.png"
              onChange={(v) => setField("logo", v)}
            />
            <div className="flex items-center gap-4 rounded-xl border border-dashed border-border p-4">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                {form.logo ? (
                  <img
                    src={form.logo}
                    alt="Logo Preview"
                    className="size-full rounded-xl object-contain"
                  />
                ) : (
                  <Building2 className="size-7" />
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                <p className="font-semibold text-foreground">Logo Preview</p>
                <p>Appears on A4 report cards, ID cards, certificates, and fee receipts.</p>
              </div>
            </div>
          </div>
        </Panel>

        <div className="flex justify-end">
          <Button type="submit" size="lg" className="gap-2">
            <Save className="size-4" /> Save Profile Settings
          </Button>
        </div>
      </form>
    </div>
  );
}

const ROLES = ["Admin", "Teacher", "Accountant", "Staff"];

export function UserManagement() {
  const { users, add, update, remove } = useApp();
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
    role: "Teacher",
    email: "",
  });
  const { confirm, dialog } = useConfirm();

  const openAdd = () => {
    setEditing(null);
    setForm({
      name: "",
      username: "",
      password: "",
      role: "Teacher",
      email: "",
    });
    setModal(true);
  };

  const openEdit = (u: any) => {
    setEditing(u);
    setForm({
      name: u.name || "",
      username: u.username || "",
      password: u.password || "",
      role: u.role || "Teacher",
      email: u.email || "",
    });
    setModal(true);
  };

  const handleSubmit = () => {
    if (!form.name.trim() || !form.username.trim() || !form.password.trim()) {
      toast.error("Please fill in Name, Username, and Password.");
      return;
    }

    if (editing) {
      update("users", editing.id, form);
      toast.success("User updated successfully!");
    } else {
      add("users", form, "usr");
      toast.success("New user account created!");
    }
    setModal(false);
  };

  const columns: Column[] = [
    {
      key: "name",
      label: "User Name",
      render: (r) => (
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
            {r.name?.charAt(0) || "U"}
          </div>
          <div>
            <p className="font-semibold">{r.name}</p>
            <p className="text-xs text-muted-foreground">{r.email || "No email"}</p>
          </div>
        </div>
      ),
    },
    { key: "username", label: "Username" },
    {
      key: "role",
      label: "Role",
      render: (r) => {
        const tone =
          r.role === "Admin"
            ? "red"
            : r.role === "Teacher"
            ? "blue"
            : r.role === "Accountant"
            ? "green"
            : "muted";
        return <Badge tone={tone}>{r.role}</Badge>;
      },
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (r) => (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => openEdit(r)}>
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:bg-destructive/10"
            onClick={() =>
              confirm(`Are you sure you want to delete user "${r.name}"?`, () => {
                remove("users", r.id);
                toast.success("User deleted.");
              })
            }
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        subtitle="Manage portal access and role permissions for administrators, faculty, and staff."
        actions={
          <Button onClick={openAdd} className="gap-2">
            <Plus className="size-4" /> Add User
          </Button>
        }
      />

      <Panel>
        <DataTable
          columns={columns}
          rows={users}
          searchKeys={["name", "username", "email", "role"]}
          exportName="users_list"
          emptyMessage="No user accounts found."
        />
      </Panel>

      <FormModal
        open={modal}
        onOpenChange={setModal}
        title={editing ? "Edit User Account" : "Create New User Account"}
        onSubmit={handleSubmit}
        submitLabel={editing ? "Update User" : "Create User"}
      >
        <TextField
          label="Full Name"
          value={form.name}
          onChange={(v) => setForm((p) => ({ ...p, name: v }))}
          required
        />
        <TextField
          label="Username"
          value={form.username}
          onChange={(v) => setForm((p) => ({ ...p, username: v }))}
          required
        />
        <TextField
          label="Password"
          type="password"
          value={form.password}
          onChange={(v) => setForm((p) => ({ ...p, password: v }))}
          required
        />
        <TextField
          label="Email Address"
          type="email"
          value={form.email}
          onChange={(v) => setForm((p) => ({ ...p, email: v }))}
        />
        <SelectField
          label="System Role"
          value={form.role}
          onChange={(v) => setForm((p) => ({ ...p, role: v }))}
          options={ROLES}
        />
      </FormModal>

      {dialog}
    </div>
  );
}

export function BackupRestore() {
  const { resetDemoData } = useApp();
  const { confirm, dialog } = useConfirm();

  const handleExport = () => {
    const data = storage.exportAll();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `harmony_school_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Data backup exported successfully!");
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const raw = ev.target?.result as string;
        const parsed = JSON.parse(raw);
        storage.importAll(parsed);
        toast.success("Backup restored successfully! Reloading page...");
        setTimeout(() => window.location.reload(), 1000);
      } catch {
        toast.error("Invalid backup file format. Please upload a valid JSON backup.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Backup & Restore"
        subtitle="Export local database backup, restore from file, or reset to original demo seed state."
      />

      <div className="grid gap-6 md:grid-cols-3">
        <Panel title="Export Backup">
          <div className="space-y-4">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Download className="size-6" />
            </div>
            <div>
              <h3 className="font-semibold">Download Full Database</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Exports all students, fees, attendance records, exams, staff, notices, and settings into a JSON backup file.
              </p>
            </div>
            <Button onClick={handleExport} className="w-full gap-2">
              <Download className="size-4" /> Export JSON Backup
            </Button>
          </div>
        </Panel>

        <Panel title="Restore Backup">
          <div className="space-y-4">
            <div className="flex size-12 items-center justify-center rounded-xl bg-accent/20 text-accent-foreground">
              <Upload className="size-6" />
            </div>
            <div>
              <h3 className="font-semibold">Import from JSON</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Restore previously exported JSON backup file. This will merge and update existing records.
              </p>
            </div>
            <label className="inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
              <Upload className="size-4" /> Select Backup File
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>
        </Panel>

        <Panel title="Reset Demo Data">
          <div className="space-y-4">
            <div className="flex size-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
              <RotateCcw className="size-6" />
            </div>
            <div>
              <h3 className="font-semibold text-destructive">Reset to Initial Seed</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Erase local changes and restore the default 24 students, sample fees, attendance, exams, and classes.
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={() =>
                confirm(
                  "Are you sure you want to reset all data back to the demo defaults? Any changes made will be lost.",
                  () => {
                    resetDemoData();
                    toast.success("Demo data reset successfully!");
                  },
                )
              }
              className="w-full gap-2"
            >
              <RotateCcw className="size-4" /> Reset Demo Data
            </Button>
          </div>
        </Panel>
      </div>

      {dialog}
    </div>
  );
}
