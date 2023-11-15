### 使用方法
#### 安装
 ```cmd
 npm install financialconversion
 ```
#### 导入并使用
```vue
import { lowerToupper, upperTolower} from 'financialconversion';

const money1 = lowerToupper(50052256.21) // 返回 伍仟零伍万贰仟贰佰伍拾陆圆贰角壹分
const money2 = upperTolower("伍仟零伍万贰仟贰佰伍拾陆圆贰角壹分") // 返回 50052256.21
```