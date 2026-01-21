<template>
    <div v-if="isOpen" class="modal-overlay">
        <div class="edit-modal">
            <div class="edit-modal__content">
                <h2>Sửa năm học</h2>
                <label>
                    Năm học
                    <input v-model="NamHoc" type="text">
                </label>
                <label>
                    Số tiết chuẩn:
                    <input v-model="SoTietChuan" type="number" min="1">
                </label>
                <label>
                    Ngày đầu năm:
                    <input v-model="formattedNgayDauNam" type="date" name="" id=""  @change="updateNgayDauNam">
                </label>
                <label>
                    Ngày cuối năm:
                    <input v-model="formattedNgayCuoiNam" type="date" name="" id="" @change="updateNgayCuoiNam">
                </label>
                <div class="modal-actions">
                    <button @click="$emit('close')">Đóng</button>
                    <button @click="luu_thong_tin">Lưu</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import '@/assets/edit-modal.css'
import axios from 'axios'
import Swal from 'sweetalert2'

export default {
    props:{
        isOpen: Boolean,
        namHoc: Object
    },

    data(){
        return{
            NamHoc: "",
            SoTietChuan: "",
            NgayDauNam: "",
            NgayCuoiNam: ""

        }
    },

    computed: {
        formattedNgayDauNam: {
            get() {
                if (!this.NgayDauNam) return '';
                const date = new Date(this.NgayDauNam);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            },
            set(value) {
                this.updateNgayDauNam({ target: { value } });
            }
        },
        formattedNgayCuoiNam: {
            get() {
                if (!this.NgayCuoiNam) return '';
                const date = new Date(this.NgayCuoiNam);                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            },
            set(value) {
                this.updateNgayCuoiNam({ target: { value } });
            }
        }
    },

    watch: {
        namHoc: {
            immediate: true,
            deep: true,
            handler(newVal) {
                if (newVal) {
                    this.NamHoc = newVal.NamHoc || "";
                    this.SoTietChuan = newVal.SoTietChuan || "";
                    
                    this.NgayDauNam = newVal.NgayDauNam ? new Date(newVal.NgayDauNam).toISOString() : "";
                    this.NgayCuoiNam = newVal.NgayCuoiNam ? new Date(newVal.NgayCuoiNam).toISOString() : "";
                } else {
                    
                    this.NamHoc = "";
                    this.SoTietChuan = "";
                    this.NgayDauNam = "";
                    this.NgayCuoiNam = "";
                }
            }
        }
    },

    methods: {
        updateNgayDauNam(e) {
            this.NgayDauNam = e.target.value ? new Date(e.target.value).toISOString() : '';
        },

        updateNgayCuoiNam(e) {
            this.NgayCuoiNam = e.target.value ? new Date(e.target.value).toISOString() : '';
        },

        luu_thong_tin(){
            const namHocDangChinhSua = {
                NamHoc: this.NamHoc,
                SoTietChuan: this.SoTietChuan,
                NgayDauNam: this.NgayDauNam,
                NgayCuoiNam: this.NgayCuoiNam
            }
            this.$emit('save', namHocDangChinhSua)
        }
    },
}
</script>