import Swal, { SweetAlertOptions, SweetAlertResult } from "sweetalert2";
import { toast } from "sonner";

// Custom luxury theme styling for JEWELAI
const luxuryCustomClass = {
  popup: "swal2-popup",
  title: "swal2-title",
  htmlContainer: "swal2-html-container",
  confirmButton: "swal2-confirm",
  cancelButton: "swal2-cancel",
  actions: "swal2-actions",
};

/**
 * Display a luxury SweetAlert success modal
 */
export function showSweetSuccess(
  title: string,
  text: string,
  options?: Record<string, any>
): Promise<SweetAlertResult> {
  return Swal.fire({
    title,
    text,
    icon: "success",
    iconColor: "#D8B77E",
    background: "#FCFBF8",
    customClass: luxuryCustomClass,
    buttonsStyling: false,
    confirmButtonText: "Splendid",
    ...(options as any),
  });
}

/**
 * Display a luxury SweetAlert error modal
 */
export function showSweetError(
  title: string,
  text: string,
  options?: Record<string, any>
): Promise<SweetAlertResult> {
  return Swal.fire({
    title,
    text,
    icon: "error",
    iconColor: "#DC2626",
    background: "#FCFBF8",
    customClass: luxuryCustomClass,
    buttonsStyling: false,
    confirmButtonText: "Understood",
    ...(options as any),
  });
}

/**
 * Display a luxury confirmation SweetAlert
 */
export function showSweetConfirm(
  title: string,
  text: string,
  confirmButtonText = "Yes, Proceed",
  cancelButtonText = "Cancel"
): Promise<SweetAlertResult> {
  return Swal.fire({
    title,
    text,
    icon: "warning",
    iconColor: "#D8B77E",
    background: "#FCFBF8",
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    customClass: luxuryCustomClass,
    buttonsStyling: false,
    reverseButtons: true,
  });
}

/**
 * Display a luxury celebration modal when Try-On completes
 */
export function showSweetTryOnReady(onViewResult?: () => void) {
  return Swal.fire({
    title: "✨ Masterpiece Rendered!",
    html: `
      <div style="padding-top: 4px;">
        <p style="color: #6B645D; font-size: 13px; line-height: 1.6;">
          Your hyper-realistic virtual jewelry try-on has been generated with photographic lighting, gemstone refraction, and anatomical precision.
        </p>
        <div style="margin-top: 12px; display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 9999px; background: #F4EFE7; border: 1px solid #E8DFC9; font-size: 11px; font-weight: 700; color: #8C6428;">
          <span>💎 2K Ultra-HD Photorealistic Finish</span>
        </div>
      </div>
    `,
    icon: "success",
    iconColor: "#D8B77E",
    background: "#FCFBF8",
    showCancelButton: true,
    confirmButtonText: "View Masterpiece",
    cancelButtonText: "Keep Editing",
    customClass: luxuryCustomClass,
    buttonsStyling: false,
  }).then((result) => {
    if (result.isConfirmed && onViewResult) {
      onViewResult();
    }
    return result;
  });
}

/**
 * Display a luxury Toast alert (sleek, non-blocking via Sonner)
 */
export function showSweetToast(
  title: string,
  icon: "success" | "info" | "warning" | "error" = "success"
) {
  if (icon === "success") {
    toast.success(title);
  } else if (icon === "info") {
    toast.info(title);
  } else if (icon === "warning") {
    toast.warning(title);
  } else {
    toast.error(title);
  }
}

export default Swal;
