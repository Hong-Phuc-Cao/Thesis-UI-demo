import axios from 'axios';
import {API_BASE_URL} from '../config'
/**
 * Định dạng ngày thành chuỗi YYYY-MM-DD
 * @param {Date} date - Ngày cần định dạng
 * @returns {string} - Chuỗi ngày định dạng YYYY-MM-DD
 */
function format_ngay(date) {
  const nam = date.getFullYear();
  const thang = date.getMonth() + 1;
  const ngay = date.getDate();
  return `${nam}-${thang}-${ngay}`;
}

/**
 * Lấy năm học hiện tại từ API
 * @returns {Promise<string|null>} - Trả về năm học hiện tại hoặc null nếu không lấy được
 */
async function lay_nam_hoc() {
  const ngayHomNay = new Date();
  try {
    const responseNamHoc = await axios.get(
      `${API_BASE_URL}/nam-hoc/lay-nam-hoc-hien-tai?NgayHomNay=${format_ngay(ngayHomNay)}`
    );
    if (responseNamHoc.data && responseNamHoc.data.result && responseNamHoc.data.result.NamHoc) {
      return responseNamHoc.data.result.NamHoc;
    }
    return null;
  } catch (error) {
    console.error('Lỗi lấy API năm học:', error);
    throw error;
  }
}

/**
 * Lấy học kỳ hiện tại từ API
 * @returns {Promise<string|null>} - Trả về học kỳ hiện tại hoặc null nếu không lấy được
 */
async function lay_hoc_ky() {
  const ngayHomNay = new Date();
  try {
    const responseHocKy = await axios.get(
      `${API_BASE_URL}/hoc-ky/lay-hoc-ky-hien-tai?NgayHomNay=${format_ngay(ngayHomNay)}`
    );
    if (responseHocKy.data && responseHocKy.data.data) {
      return responseHocKy.data.data;
    }
    return null;
  } catch (error) {
    console.error('Lỗi lấy API học kỳ:', error);
    throw error;
  }
}

export { format_ngay, lay_nam_hoc, lay_hoc_ky };