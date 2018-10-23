import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);
/**
 * 路由懒加载
 */
const Recommend = resolve => {
  import("@/view/recommend").then(module => {
    resolve(module);
  });
};

const Singer = resolve => {
  import("@/view/singer").then(module => {
    resolve(module);
  });
};

const Rank = resolve => {
  import("@/view/rank").then(module => {
    resolve(module);
  });
};

const Search = resolve => {
  import("@/view/search").then(module => {
    resolve(module);
  });
};

const Disc = resolve => {
  import("@/view/disc").then(module => {
    resolve(module);
  });
};

const SingerDetail = resolve => {
  import("@/view/singer/detail").then(module => {
    resolve(module);
  });
};

const TopList = resolve => {
  import("@/view/rank/detail").then(module => {
    resolve(module);
  });
};

const UserCenter = resolve => {
  import("@/components/user-center").then(module => {
    resolve(module);
  });
};

export default new Router({
  routes: [
    {
      path: "/",
      redirect: "/recommend"
    },
    {
      path: "/rank",
      name: "",
      component: Rank,
      children: [
        {
          path: ":id",
          component: TopList
        }
      ]
    },
    {
      path: "/recommend",
      name: "",
      component: Recommend,
      children: [
        {
          path: ":id",
          component: Disc
        }
      ]
    },
    {
      path: "/search",
      name: "",
      component: Search,
      children: [
        {
          path: ":id",
          name: "",
          component: SingerDetail
        }
      ]
    },
    {
      path: "/singer",
      name: "",
      component: Singer,
      children: [
        {
          path: ":id",
          name: "",
          component: SingerDetail
        }
      ]
    },
    {
      path: "/user",
      component: UserCenter
    }
  ]
});
