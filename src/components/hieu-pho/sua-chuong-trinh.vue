<template>
    <div v-if="isOpen" class="modal-overlay">
        <div class="edit-modal">
            <div class="edit-modal__content">
                <h2>Sửa chương trình</h2>
                <label for="">
                    Học kỳ:
                    <input v-model="HocKy" disabled type="text">
                </label>
                <label for="">
                    Khối:
                    <input v-model="Khoi" disabled type="text">
                </label>
                <label for="">
                    Nhóm môn học:
                    <input v-model="TenNhom" disabled type="text">
                </label>
                <label for="">
                    Môn học:
                    <input v-model="TenMon" disabled type="text">
                </label>
                <label for="">
                    Số tiết trong tuần:
                    <input v-model="SoTietTuan" type="number">
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
export default {
    props:{
        isOpen: Boolean,
        chuongTrinh: Object
    },

    data(){
        return{
            HocKy: '',
            Khoi: '',
            MaNhom: '',
            TenNhom: '',
            MaMon: '',
            TenMon: '',
            SoTietTuan: ''
        }
    },

    watch:{
        chuongTrinh:{
            immediate: true,
            deep: true,
            handler(newVal){
                if(newVal){
                    this.HocKy = newVal.HocKy || ""
                    this.Khoi = newVal.Khoi || ""
                    this.MaNhom = newVal.MaNhom || ""
                    this.TenNhom = newVal.TenNhom || ""
                    this.MaMon = newVal.MaMon || ""
                    this.TenMon = newVal.TenMon || ""
                    this.SoTietTuan = newVal.SoTietTuan || ""
                }
            }
        }
    },
    
    methods: {

        luu_thong_tin(){
            const chuongTrinhDangChinhSua = {
                Khoi: this.Khoi,
                MaNhom: this.MaNhom,
                HocKy: this.HocKy,
                MaMon: this.MaMon,
                SoTietTuan: this.SoTietTuan
            }

            this.$emit('save', chuongTrinhDangChinhSua)
        }
    },
}
</script>