import axios from "axios";

const API =
  `${import.meta.env.VITE_API_URL}/import`;

export const importProducts = async (
  file
) => {
  const formData = new FormData();

  formData.append(
    "file",
    file
  );

  const response =
    await axios.post(
      `${API}/products`,
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

  return response.data;
};