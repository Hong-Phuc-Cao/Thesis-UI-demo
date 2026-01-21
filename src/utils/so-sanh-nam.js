/**
 * So sánh năm học để xác định mối quan hệ giữa năm hiện tại và năm cần kiểm tra.
 * @param {string} namHocHienTai - Năm học hiện tại (định dạng "YYYY-YYYY")
 * @param {string} namHocKiemTra - Năm học cần kiểm tra (định dạng "YYYY-YYYY")
 * @returns {string} - Kết quả so sánh: 'nam_truoc', 'nam_hien_tai', 'nam_sau', hoặc 'khong_hop_le'
 */
function so_sanh_nam_hoc(namHocHienTai, namHocKiemTra) {
    // Kiểm tra định dạng năm học
    const regex = /^\d{4}-\d{4}$/;
    if (!regex.test(namHocHienTai) || !regex.test(namHocKiemTra)) {
        return 'khong_hop_le';
    }

    // Tách năm bắt đầu và kết thúc
    const [namBatDauHienTai, namKetThucHienTai] = namHocHienTai.split('-').map(Number);
    const [namBatDauKiemTra, namKetThucKiemTra] = namHocKiemTra.split('-').map(Number);

    // Kiểm tra tính hợp lệ của năm học
    if (namKetThucHienTai - namBatDauHienTai != 1 || namKetThucKiemTra - namBatDauKiemTra != 1) {
        return 'khong_hop_le';
    }

    // So sánh năm học
    if (namBatDauKiemTra == namBatDauHienTai) {
        return 'nam_hien_tai';
    } else if (namBatDauKiemTra == namBatDauHienTai - 1) {
        return 'nam_truoc';
    } else if (namBatDauKiemTra == namBatDauHienTai + 1) {
        return 'nam_sau';
    }

    return 'khong_hop_le';
}

/**
 * Kiểm tra xem giáo viên có được phép sửa dữ liệu của năm học hay không.
 * @param {string} namHocHienTai - Năm học hiện tại (định dạng "YYYY-YYYY")
 * @param {string} namHocKiemTra - Năm học cần kiểm tra (định dạng "YYYY-YYYY")
 * @returns {boolean} - True nếu được phép sửa (năm hiện tại hoặc năm sau), False nếu không (năm trước hoặc không hợp lệ)
 */
function kiem_tra_sua_du_lieu(namHocHienTai, namHocKiemTra) {
    const ketQua = so_sanh_nam_hoc(namHocHienTai, namHocKiemTra);
    return ketQua == 'nam_hien_tai' || ketQua == 'nam_sau';
}

export { so_sanh_nam_hoc, kiem_tra_sua_du_lieu };