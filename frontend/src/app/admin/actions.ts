"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { API_BASE_URL } from "@/config";

// Helper to authenticate actions
async function verifySession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  if (!session || session.value !== "authenticated") {
    throw new Error("Unauthorized");
  }
}

// Helper to construct headers with the secret token
function getAdminHeaders() {
  const secret = process.env.ADMIN_API_SECRET || "dev-secret-key-123";
  return {
    "Content-Type": "application/json",
    "X-Admin-Token": secret,
  };
}

export async function loginAction(username: string, password: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin-login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok && data.success) {
      const cookieStore = await cookies();
      cookieStore.set("admin_session", "authenticated", { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production", 
        path: "/",
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });
      return { success: true };
    }
    
    return { success: false, error: data.error || "Incorrect username or password" };
  } catch (error) {
    console.error("Login Error:", error);
    return { success: false, error: "Could not connect to the authentication server." };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/admin");
}

export async function getDashboardStats() {
  try {
    await verifySession();
    const res = await fetch(`${API_BASE_URL}/api/admin-stats/`, {
      headers: getAdminHeaders(),
      cache: "no-store"
    });
    if (!res.ok) throw new Error("Failed to fetch dashboard stats");
    return await res.json();
  } catch (error: any) {
    console.error("getDashboardStats error:", error);
    return { error: error.message || "Something went wrong" };
  }
}

export async function getSiteSettings() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/settings/`, {
      cache: "no-store"
    });
    if (!res.ok) throw new Error("Failed to fetch settings");
    return await res.json();
  } catch (error: any) {
    console.error("getSiteSettings error:", error);
    return { is_registration_active: true }; // default fallback
  }
}

export async function updateSiteSettings(isActive: boolean) {
  try {
    await verifySession();
    const res = await fetch(`${API_BASE_URL}/api/admin-settings/`, {
      method: "PATCH",
      headers: getAdminHeaders(),
      body: JSON.stringify({ is_registration_active: isActive }),
      cache: "no-store"
    });
    if (!res.ok) throw new Error("Failed to update settings");
    return { success: true, data: await res.json() };
  } catch (error: any) {
    console.error("updateSiteSettings error:", error);
    return { success: false, error: error.message };
  }
}

export async function getSubmissions() {
  try {
    await verifySession();
    const res = await fetch(`${API_BASE_URL}/api/submissions/`, {
      headers: getAdminHeaders(),
      cache: "no-store"
    });
    if (!res.ok) throw new Error("Failed to fetch submissions");
    return await res.json();
  } catch (error: any) {
    console.error("getSubmissions error:", error);
    return [];
  }
}

export async function getStudentSubmissions(studentId: number) {
  try {
    await verifySession();
    const res = await fetch(`${API_BASE_URL}/api/submissions/?student_id=${studentId}`, {
      headers: getAdminHeaders(),
      cache: "no-store"
    });
    if (!res.ok) throw new Error("Failed to fetch student submissions");
    return await res.json();
  } catch (error: any) {
    console.error("getStudentSubmissions error:", error);
    return [];
  }
}

export async function updateSubmissionPaymentStatus(id: number, status: string) {
  try {
    await verifySession();
    const res = await fetch(`${API_BASE_URL}/api/submissions/${id}/`, {
      method: "PATCH",
      headers: getAdminHeaders(),
      body: JSON.stringify({ payment_status: status })
    });
    if (!res.ok) throw new Error("Failed to update payment status");
    return { success: true, data: await res.json() };
  } catch (error: any) {
    console.error("updateSubmissionPaymentStatus error:", error);
    return { success: false, error: error.message };
  }
}

export async function updateSubmissionMarks(id: number, marks: number) {
  try {
    await verifySession();
    const res = await fetch(`${API_BASE_URL}/api/submissions/${id}/update_marks/`, {
      method: "PATCH",
      headers: getAdminHeaders(),
      body: JSON.stringify({ marks })
    });
    if (!res.ok) throw new Error("Failed to update marks");
    return { success: true, data: await res.json() };
  } catch (error: any) {
    console.error("updateSubmissionMarks error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteSubmission(id: number) {
  try {
    await verifySession();
    const res = await fetch(`${API_BASE_URL}/api/submissions/${id}/`, {
      method: "DELETE",
      headers: getAdminHeaders()
    });
    if (!res.ok) throw new Error("Failed to delete submission");
    return { success: true };
  } catch (error: any) {
    console.error("deleteSubmission error:", error);
    return { success: false, error: error.message };
  }
}

export async function adminAddRegistration(data: any) {
  try {
    await verifySession();
    const res = await fetch(`${API_BASE_URL}/api/admin/registrations/add/`, {
      method: "POST",
      headers: getAdminHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(JSON.stringify(errorData));
    }
    return { success: true, data: await res.json() };
  } catch (error: any) {
    console.error("adminAddRegistration error:", error);
    return { success: false, error: error.message };
  }
}

export async function adminBulkAddRegistrations(registrations: any[]) {
  try {
    await verifySession();
    const res = await fetch(`${API_BASE_URL}/api/admin/registrations/bulk-add/`, {
      method: "POST",
      headers: getAdminHeaders(),
      body: JSON.stringify(registrations)
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(JSON.stringify(errorData));
    }
    return { success: true, data: await res.json() };
  } catch (error: any) {
    console.error("adminBulkAddRegistrations error:", error);
    return { success: false, error: error.message };
  }
}

export async function adminBulkUploadMarks(marksData: any[]) {
  try {
    await verifySession();
    const res = await fetch(`${API_BASE_URL}/api/admin/registrations/bulk-marks/`, {
      method: "POST",
      headers: getAdminHeaders(),
      body: JSON.stringify(marksData)
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(JSON.stringify(errorData));
    }
    return { success: true, data: await res.json() };
  } catch (error: any) {
    console.error("adminBulkUploadMarks error:", error);
    return { success: false, error: error.message };
  }
}

export async function getTierForms() {
  try {
    await verifySession();
    const res = await fetch(`${API_BASE_URL}/api/admin/forms/`, {
      headers: getAdminHeaders(),
      cache: "no-store"
    });
    if (!res.ok) throw new Error("Failed to fetch forms");
    return await res.json();
  } catch (error: any) {
    console.error("getTierForms error:", error);
    return [];
  }
}

export async function saveTierForm(id: number | null, data: any) {
  try {
    await verifySession();
    const url = id 
      ? `${API_BASE_URL}/api/admin/forms/${id}/` 
      : `${API_BASE_URL}/api/admin/forms/`;
    const method = id ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: getAdminHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to save level template");
    return { success: true, data: await res.json() };
  } catch (error: any) {
    console.error("saveTierForm error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteTierForm(id: number) {
  try {
    await verifySession();
    const res = await fetch(`${API_BASE_URL}/api/admin/forms/${id}/`, {
      method: "DELETE",
      headers: getAdminHeaders()
    });
    if (!res.ok) throw new Error("Failed to delete level template");
    return { success: true };
  } catch (error: any) {
    console.error("deleteTierForm error:", error);
    return { success: false, error: error.message };
  }
}

export async function getStudents(trash = false) {
  try {
    await verifySession();
    const res = await fetch(`${API_BASE_URL}/api/admin/students/?trash=${trash}`, {
      headers: getAdminHeaders(),
      cache: "no-store"
    });
    if (!res.ok) throw new Error("Failed to fetch students");
    return await res.json();
  } catch (error: any) {
    console.error("getStudents error:", error);
    return [];
  }
}

export async function restoreStudent(id: number) {
  try {
    await verifySession();
    const res = await fetch(`${API_BASE_URL}/api/admin/students/${id}/restore/`, {
      method: "POST",
      headers: getAdminHeaders(),
      cache: "no-store"
    });
    if (!res.ok) throw new Error("Failed to restore student profile");
    return { success: true };
  } catch (error: any) {
    console.error("restoreStudent error:", error);
    return { success: false, error: error.message };
  }
}


export async function promoteStudent(id: number, tierId: number) {
  try {
    await verifySession();
    const res = await fetch(`${API_BASE_URL}/api/admin/students/${id}/promote/`, {
      method: "POST",
      headers: getAdminHeaders(),
      body: JSON.stringify({ tier_id: tierId })
    });
    if (!res.ok) throw new Error("Failed to promote student");
    return { success: true, data: await res.json() };
  } catch (error: any) {
    console.error("promoteStudent error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteStudent(id: number) {
  try {
    await verifySession();
    const res = await fetch(`${API_BASE_URL}/api/admin/students/${id}/`, {
      method: "DELETE",
      headers: getAdminHeaders()
    });
    if (!res.ok) throw new Error("Failed to delete student profile");
    return { success: true };
  } catch (error: any) {
    console.error("deleteStudent error:", error);
    return { success: false, error: error.message };
  }
}

export async function getAgents() {
  try {
    await verifySession();
    const res = await fetch(`${API_BASE_URL}/api/admin/agents/`, {
      headers: getAdminHeaders(),
      cache: "no-store"
    });
    if (!res.ok) throw new Error("Failed to fetch agents");
    return await res.json();
  } catch (error: any) {
    console.error("getAgents error:", error);
    return [];
  }
}

export async function saveAgent(id: number | null, data: any) {
  try {
    await verifySession();
    const url = id 
      ? `${API_BASE_URL}/api/admin/agents/${id}/` 
      : `${API_BASE_URL}/api/admin/agents/`;
    const method = id ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: getAdminHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to save agent");
    return { success: true, data: await res.json() };
  } catch (error: any) {
    console.error("saveAgent error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteAgent(id: number) {
  try {
    await verifySession();
    const res = await fetch(`${API_BASE_URL}/api/admin/agents/${id}/`, {
      method: "DELETE",
      headers: getAdminHeaders()
    });
    if (!res.ok) throw new Error("Failed to delete agent");
    return { success: true };
  } catch (error: any) {
    console.error("deleteAgent error:", error);
    return { success: false, error: error.message };
  }
}

export async function getSchools() {
  try {
    await verifySession();
    const res = await fetch(`${API_BASE_URL}/api/admin/schools/`, {
      headers: getAdminHeaders(),
      cache: "no-store"
    });
    if (!res.ok) throw new Error("Failed to fetch schools");
    return await res.json();
  } catch (error: any) {
    console.error("getSchools error:", error);
    return [];
  }
}

export async function saveSchool(id: number | null, data: any) {
  try {
    await verifySession();
    const url = id 
      ? `${API_BASE_URL}/api/admin/schools/${id}/` 
      : `${API_BASE_URL}/api/admin/schools/`;
    const method = id ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: getAdminHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to save school");
    return { success: true, data: await res.json() };
  } catch (error: any) {
    console.error("saveSchool error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteSchool(id: number) {
  try {
    await verifySession();
    const res = await fetch(`${API_BASE_URL}/api/admin/schools/${id}/`, {
      method: "DELETE",
      headers: getAdminHeaders()
    });
    if (!res.ok) throw new Error("Failed to delete school");
    return { success: true };
  } catch (error: any) {
    console.error("deleteSchool error:", error);
    return { success: false, error: error.message };
  }
}
