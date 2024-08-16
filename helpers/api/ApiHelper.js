export class ApiHelper {
  static async fetchAndExtractFields(url, fields) {
    try {
      const response = await fetch(url);
      const data = await response.json();

      const extractedData = data.results.map((item) => {
        const result = {};
        fields.forEach((field) => {
          if (item.hasOwnProperty(field)) {
            result[field] = item[field];
          }
        });
        return result;
      });

      return extractedData;
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      throw error;
    }
  }
}
