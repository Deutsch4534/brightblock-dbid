import xhrService from "@/services/xhrService";

const contentStore = {
  namespaced: true,
  state: {
    content: {},
  },
  getters: {
    getContent: state => pageId => {
      let matches = state.content.filter(content => content.pages.id === pageId);
      return matches;
    },
    getAnswers: state => questionId => {
      let matches = state.content["answers"];
      return matches;
    },
    getIndex: state => {
      return state.content.index;
    },
  },
  mutations: {
    indexPage(state, o) {
      state.content["index-page"] = o;
    },
    helpList(state, o) {
      state.content["help-list"] = o;
    },
    answers(state, o) {
      state.content["answers"] = o;
    },
  },
  actions: {
    fetchMediumArticles: function({ commit }, pair) {
      return new Promise(resolve => {
        const url = "https://medium.com/@radicleart/latest?format=json";
        xhrService.makeDirectCall(url).then(function(articles) {
          resolve(articles);
        });
      });
    },
    fetchIndexPage({ commit, state, getters}) {
      return new Promise(resolve => {
        /**
        PrismicVue.client.getSingle("donate").then(document => {
          state.content["donate"] = {
            title: document.data.title[0].text,
            description: document.data.description[0].text,
            btcAddress: document.data.btc_address[0].text,
          };

          PrismicVue.client.getSingle("navbar").then(document => {
            state.content["navbar"] = {
              tagline: document.data.tagline[0].text,
              taglink1: document.data.taglink1[0].text,
              bgImage: document.data.background.url,
            };

            PrismicVue.client.query(PrismicVue.Predicates.at("document.type", "mission_feature"), {
              orderings: "[my.mission_feature.title]"
            })
              .then(function(response) {
                state.content["mission"] = {
                  features: response.results,
                };

                PrismicVue.client.getSingle("mission").then(document => {
                  state.content["mission"] = {
                    title: document.data.title[0].text,
                    statement: document.data.statement[0].text,
                  };

                  PrismicVue.client.getSingle("profile").then(document1 => {
                    PrismicVue.client.query(PrismicVue.Predicates.at("document.type", "mini_profile"), {
                      orderings: "[my.mini_profile.name desc]"
                    })
                      .then(function(response) {
                        state.content["profile"] = {
                          title: document1.data.title[0].text,
                          profiles: response.results
                        };
                      });
                  });
                });
              });

          });
        });
        **/
      });
    },
  }
};
export default contentStore;
