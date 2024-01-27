const names = {
  review: "ProfileReview",
};

const breadcrumbs = {
  review: { title: "Profile reviews", to: { name: names.review } },
};

export default [
  {
    name: names.review,
    path: "/profile/reviews",
    component: () => import("@/views/profile/ViewReview.vue"),
    meta: {
      breadcrumb: [breadcrumbs.review],
    },
  },
];
