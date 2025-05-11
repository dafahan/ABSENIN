import Swal from "sweetalert2";


export const showSuccessToast = (message) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: message,
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
};

export const showErrorToast = (message) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "error",
      title: message,
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
};


    