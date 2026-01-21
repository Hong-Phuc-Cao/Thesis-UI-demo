<template>
  <div class="thong-tin-ca-nhan">
    <h2>Thông tin cá nhân</h2>
    <div class="thong-tin-wrapper">
      <div class="thong-tin-item">
        <span class="label">Mã giáo viên:</span>
        <span class="value">{{ MaGV }}</span>
      </div>

      <div class="thong-tin-item">
        <span class="label">Họ và tên:</span>
        <span class="value">{{ HoTenGV }}</span>
      </div>

      <div class="thong-tin-item">
        <span class="label">Ngày sinh:</span>
        <span class="value">{{ formatNgaySinh(NgaySinh) }}</span>
      </div>

      <div class="thong-tin-item">
        <span class="label">Giới tính:</span>
        <span class="value">{{ GioiTinh == 1 ? "Nam" : "Nữ" }}</span>
      </div>

      <div class="thong-tin-item">
        <span class="label">Số điện thoại:</span>
        <span class="value">{{ SoDT }}</span>
      </div>

      <div class="thong-tin-item">
        <span class="label">Email:</span>
        <span class="value">{{ Mail }}</span>
      </div>

      <div class="thong-tin-item">
        <span class="label">Địa chỉ:</span>
        <span class="value">{{ DiaChi }}</span>
      </div>

      <div class="thong-tin-item">
        <span class="label">Bộ môn:</span>
        <span class="value">{{ TenBM }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {API_BASE_URL} from '../../config'
export default {
  name: "ThongTinCaNhan",
  data() {
    return {
      MaGV: "",
      HoTenGV: "",
      NgaySinh: "",
      GioiTinh: 1,
      SoDT: "",
      Mail: "",
      DiaChi: "",
      MaBM: "",
      MaCV: "",
      TenBM: "",
    };
  },
  async created() {
    await this.goi_api_lay_thong_tin_session();
    await this.goi_api_lay_thong_tin_giao_vien();
  },
  methods: {
    async goi_api_lay_thong_tin_session() {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/dang-nhap/lay-thong-tin-session`,
          { withCredentials: true }
        );

        if (response.data.success) {
          this.MaCV = response.data.thongTinSession.MaCV;
          this.MaGV = response.data.thongTinSession.MaGV;
          this.TenBM = response.data.thongTinSession.TenBM;
        }
        console.log("Thông tin từ session:", response.data);
      } catch (error) {
        console.error("Lỗi gọi api lấy thông tin session", error);
        throw error;
      }
    },

    async goi_api_lay_thong_tin_giao_vien() {
      try {
        console.log(this.MaGV);
        const response = await axios.get(
          `${API_BASE_URL}/giao-vien/tim-giao-vien?keyword=${this.MaGV}`
        );
        if (response.data.success) {
          this.MaGV = response.data.data[0].MaGV;
          this.HoTenGV = response.data.data[0].HoTenGV;
          this.NgaySinh = response.data.data[0].NgaySinh;
          this.GioiTinh = response.data.data[0].GioiTinh;
          this.SoDT = response.data.data[0].SoDT;
          this.Mail = response.data.data[0].Mail;
          this.DiaChi = response.data.data[0].DiaChi;
          this.MaBM = response.data.data[0].MaBM;
        }
      } catch (error) {
        console.error("Lỗi gọi api lấy thông tin giáo viên", error);
        throw error;
      }
    },

    formatNgaySinh(ngaySinh) {
      if (!ngaySinh) return "";
      const date = new Date(ngaySinh);
      return date.toLocaleDateString("vi-VN");
    },
  },
};
</script>

<style scoped>
.thong-tin-ca-nhan {
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
  background-color: #e6f7ff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.thong-tin-wrapper {
  
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.thong-tin-item {
  display: flex;
  flex-direction: column;
  padding: 10px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.label {
  font-weight: bold;
  color: #555;
  margin-bottom: 5px;
}

.value {
  color: #333;
}

@media (max-width: 768px) {
  .thong-tin-wrapper {
    grid-template-columns: 1fr;
  }
}
</style>
