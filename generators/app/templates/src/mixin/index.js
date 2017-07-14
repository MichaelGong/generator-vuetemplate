import { regRule } from '../util';
export default {
    data() {
        return {

        }
    },
    methods:{
        // 只能输入数字
        onlyNumber(value) {
            if (!(/^\S+$/.test(value))) { // 空的判断
                return '';
            }
            return value.replace(/[^0-9]/g,'');
        },

    }
}
