# React 组件模板

## 使用方法

### 安装@talentui/cli

```bash
  yarn global add @talentui/cli 
  # 或者
  npm install -g @talentui/cli
```

### 使用talentui cli生成本地组件模板

```bash
# 全局安装完talentui-cli会在全局生成一个talentui的命令工具
  talentui init my-component
```
然后在项目类型中选择组件

### 启动项目

```bash
cd my-component
yarn
yarn dev
```

### 提交
在模板项目中我们使用了commitizen+@talentui/cz-package-changelog来标准化git log, 所以在完成修改之后，可以直接执行 `yarn commit`来提交修改的代码，当然不要忘初始化git
```bash
yarn commit
```

## 参考：
* [commitizen](https://github.com/commitizen/cz-cli)
* [@talentui/cz-package-changelog](https://github.com/talentui/cz-package-changelog)