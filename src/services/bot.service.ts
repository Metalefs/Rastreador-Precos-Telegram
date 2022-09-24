import { getBudgetAsPercentage, getBudget } from "../budgetCalculator";
import { PriceFinder } from "../getBestPrices";
import { splitIntoChunk } from "../util";
import { CategoriesService } from "./categories";
import { ExpensesService } from "./expenses";
import { uploadProductScreenshot, uploadWishlistScreenshot } from "./files";
import { ProductsService } from "./products";

export class BotService {
  income = {};
  expenses = {};
  constructor(
    private bot,
    private productService: ProductsService,
    private categoryService: CategoriesService,
    private expenseService: ExpensesService,
    private priceFinder: PriceFinder
  ) {
    this.bot.nextMessage = {};
    this.bot.onNextMessage = (chatId, callback) => {
      let promise = new Promise((resolve) => {
        this.bot.nextMessage[chatId] = { callback: callback, next: resolve };
      });
      return promise;
    };
  }

  start = async (msg, match) => {
    const [chatId] = [msg.chat.id];

    let commands = [
      ["/mywishlist"],
      ["/setincome"],
      ["/mybudget"],

      ["/addwishlist"],
      ["/enrich"],
      ["/searchwishlist 0"],
      ["/removewishlist 0"],
      ["/emptywishlist"],
      ["/wishlistOffers"],
    ];

    this.bot.sendMessage(
      chatId,
      "Bem vindo! Vou te ajudar a conquistar todos os seus sonhos materiais com responsabilidade."
    );
    this.bot
      .sendMessage(chatId, "Para começar, insira a sua renda mensal.")
      .then(() => {
        return this.bot.onNextMessage(chatId, async (msg) => {
          this.income[chatId] = msg.text;
          this.sendSetIncomeReply(chatId);

          await this.bot.sendMessage(
            chatId,
            "Vamos configurar as tuas despesas?"
          );
          Object.assign(this.expenses, { [chatId]: {} });
          this.bot
            .sendMessage(chatId, "Insira o seu gasto com aluguel")
            .then(() => {
              return this.bot.onNextMessage(chatId, async (msg) => {
                Object.assign(this.expenses[chatId], { rent: msg.text });

                await this.bot.sendMessage(
                  chatId,
                  "Despesa com aluguel setada para " +
                    this.expenses[chatId]["rent"]
                );
                this.bot
                  .sendMessage(
                    chatId,
                    "Agora, insira o gasto com investimentos"
                  )
                  .then(() => {
                    return this.bot.onNextMessage(chatId, async (msg) => {
                      Object.assign(this.expenses[chatId], {
                        investments: msg.text,
                      });
                      await this.bot.sendMessage(
                        chatId,
                        "Investimento setado para " +
                          this.expenses[chatId]["investments"]
                      );

                      this.bot
                        .sendMessage(chatId, "Seu gasto com supermercado: ")
                        .then(() => {
                          return this.bot.onNextMessage(chatId, async (msg) => {
                            Object.assign(this.expenses[chatId], {
                              groceries: msg.text,
                            });
                            await this.bot.sendMessage(
                              chatId,
                              "Supermercado setado para " +
                                this.expenses[chatId]["groceries"]
                            );
                            this.bot
                              .sendMessage(chatId, "Seu gasto com contas: ")
                              .then(() => {
                                return this.bot.onNextMessage(
                                  chatId,
                                  async (msg) => {
                                    Object.assign(this.expenses[chatId], {
                                      bills: msg.text,
                                    });
                                    await this.bot.sendMessage(
                                      chatId,
                                      "Contas setado para " +
                                        this.expenses[chatId]["bills"]
                                    );
                                    this.bot
                                      .sendMessage(
                                        chatId,
                                        "Seu gasto com serviços por assinatura: "
                                      )
                                      .then(() => {
                                        return this.bot.onNextMessage(
                                          chatId,
                                          async (msg) => {
                                            Object.assign(
                                              this.expenses[chatId],
                                              {
                                                subscriptions: msg.text,
                                              }
                                            );
                                            await this.bot.sendMessage(
                                              chatId,
                                              "Assinaturas setado para " +
                                                this.expenses[chatId][
                                                  "subscriptions"
                                                ]
                                            );
                                            this.bot
                                              .sendMessage(
                                                chatId,
                                                "Seu gasto com impostos: "
                                              )
                                              .then(async () => {
                                                return this.bot.onNextMessage(
                                                  chatId,
                                                  async (msg) => {
                                                    Object.assign(
                                                      this.expenses[chatId],
                                                      {
                                                        taxes: msg.text,
                                                      }
                                                    );
                                                    await this.bot.sendMessage(
                                                      chatId,
                                                      "Impostos setado para " +
                                                        this.expenses[chatId][
                                                          "taxes"
                                                        ]
                                                    );

                                                    this.bot.sendMessage(
                                                      chatId,
                                                      "Estamos prontos! Segue uma analise do seu orçamento:"
                                                    );

                                                    const budget = getBudget(
                                                      this.income[chatId],
                                                      this.expenses[chatId]
                                                    );
                                                    const budgetPercentage =
                                                      getBudgetAsPercentage(
                                                        this.income[chatId],
                                                        this.expenses[chatId]
                                                      );
                                                    await this.bot.sendMessage(
                                                      chatId,
                                                      "Seu valor disponível para torrar é : R$" + JSON.stringify(budget)
                                                    );
                                                    Object.assign(this.expenses[chatId],
                                                      {
                                                        available: budget,
                                                      }
                                                    );
                                                    await this.expenseService.add(this.expenses[chatId]);
                                                    await this.bot.sendMessage(chatId, 'Despesas salvas.');
                                                    await this.bot.sendMessage(
                                                      chatId,
                                                      this.parseBudgetPercentage(budgetPercentage),
                                                      {
                                                        parse_mode : "HTML",
                                                      }
                                                    );
                                                    await this.bot.sendMessage(chatId, "Pronto para utilizar os comandos:", 
                                                    {
                                                      reply_markup: {
                                                        keyboard: commands,
                                                      }
                                                    })
                                                  }
                                                );
                                              });
                                          }
                                        );
                                      });
                                  }
                                );
                              });
                          });
                        });
                    });
                  });
              });
            });
        });
      });
  };

  private parseBudgetPercentage(budgetPercentage){
    return "Seu orçamento em porcentagem: " +  `
      <b>Aluguel: </b><i>${budgetPercentage.rent}</i>
      <b>Investimentos: </b><i>${budgetPercentage.investments}</i>
      <b>Supermercado: </b><i>${budgetPercentage.groceries}</i>
      <b>Contas: </b><i>${budgetPercentage.bills}</i>
      <b>Assinaturas: </b><i>${budgetPercentage.subscriptions}</i>
      <b>Impostos: </b><i>${budgetPercentage.taxes}</i>
      <b>Disponível: </b><i>${budgetPercentage.budget}</i>
      `;
  }

  setincome = async (msg, match) => {
    const chatId = msg.chat.id;
    const income = match.input.replace("/setincome", "");
    if (income === "") {
      this.bot.sendMessage(chatId, "Por favor, passe um valor para renda");
      return;
    }
    this.income[chatId] = income;
    
    this.sendSetIncomeReply(chatId);

    const budget = getBudget(this.income[chatId], this.expenses[chatId]);
    Object.assign(this.expenses[chatId],
      {
        available: budget,
      }
    );
    await this.expenseService.add(this.expenses[chatId]);
    await this.bot.sendMessage(chatId, 'Despesas salvas. Novo valor disponível: R$' + budget);
  };

  private sendSetIncomeReply(chatId) {
    this.bot.sendMessage(chatId, "Renda setada para " + this.income[chatId]);
  }

  mybudget = async (msg, match) => {
    const [chatId, idx] = this.parseChat(msg, match);
    if (!this.income[chatId]) {
      this.bot.sendMessage(
        chatId,
        "Primeiro defina a sua renda com /setincome"
      );
      return;
    }
    const budget = getBudget(this.income[chatId], this.expenses[chatId]);
    const budgetPercentage = getBudgetAsPercentage(this.income[chatId]);
    this.bot.sendMessage(chatId, JSON.stringify(budget));
    this.bot.sendMessage(
      chatId,
      this.parseBudgetPercentage(budgetPercentage),
      {
        parse_mode : "HTML",
      }
    );
  };

  enrich = async (msg, match) => {
    const [chatId, idx] = this.parseChat(msg, match);

    let products = await this.productService.getWishlist();
    const offers = await this.priceFinder.getPrices(
      products.map((prd) => prd.name)
    );

    this.bot.sendMessage(chatId, JSON.stringify(offers, undefined, 4));
  };

  searchwishlist = async (msg, match) => {
    const [chatId, idx] = this.parseChat(msg, match);

    if (idx === undefined) {
      this.bot.on("callback_query", (callBackQuery) => {
        const callBackData = callBackQuery.data;
        console.log(callBackData);
        this.bot.answerCallbackQuery(callBackQuery.id).then((e) => {
          this.bot.sendMessage(chatId, "teste");
        });
      });
      return;
    }

    let products = await this.productService.getWishlistById(idx);
    const offers = await this.priceFinder.getPrices(
      products.map((prd) => prd.name)
    );

    this.bot.sendMessage(chatId, JSON.stringify(offers, undefined, 4));
  };

  addwishlist = async (msg, match) => {
    const chatId = msg.chat.id;
    const productName = match.input.replace("/addwishlist", "");
    if (productName === "") {
      this.bot.sendMessage(
        chatId,
        "Por favor, forneca o nome de um produto. Ex: /addwishlist caderno do zachbell"
      );
      return;
    }

    await this.productService.addTowishlist(productName);
    const [path] = await this.getWishlistScreenshot();

    const categories = await this.categoryService.list();

    this.bot
      .sendMessage(chatId, "Defina uma categoria para o produto:", {
        reply_markup: JSON.stringify({
          force_reply: true,
          keyboard: splitIntoChunk(
            categories.map((cat) => {
              return cat.name;
            }),
            1
          ),
          resize_keyboard: true,
          one_time_keyboard: true,
        }),
      })
      .then(() => {
        return this.bot.onNextMessage(chatId, async (msg) => {
          await this.addProductToCategory(productName, msg.text);

          this.bot.sendMessage(
            chatId,
            `Produto foi rotulado com a categoria "${msg.text}"`,
            {
              reply_markup: JSON.stringify({
                remove_keyboard: true,
              }),
            }
          );

          this.bot.sendPhoto(chatId, path, {
            caption: "Aqui está a sua lista",
          });
        });
      });
  };

  mywishlist = async (msg, match) => {
    const [chatId] = this.parseChat(msg, match);
    const [path] = await this.getWishlistScreenshot();
    this.bot.sendPhoto(chatId, path, { caption: "Aqui está a sua lista !" });
  };

  removewishlist = async (msg, match) => {
    const [chatId, id] = this.parseChat(msg, match);

    if (!id) {
      this.bot.sendMessage(
        chatId,
        "Esse comando precisa de um argumento. Ex: /wishlist {{id}}"
      );
      return;
    }

    await this.productService.removeWishlist(id);
    const [path] = await this.getWishlistScreenshot();

    this.bot.sendPhoto(chatId, path, { caption: "Aqui está a sua lista !" });
  };

  emptywishlist = async (msg, match) => {
    const [chatId, resp] = this.parseChat(msg, match);
    await this.productService.emptyWishlist();
    this.bot.sendMessage(chatId, "Lista apagada com sucesso.");
  };

  wishlistOffers = async (msg, match) => {
    const [chatId, resp] = this.parseChat(msg, match);
    let products = await this.productService.list();
    let result = await uploadProductScreenshot(products);

    this.bot.sendPhoto(msg.chat.id, result);
  };

  async addProductToCategory(product, category) {
    return this.productService.addToCategory(product, category);
  }

  private parseChat(msg, match) {
    return [msg.chat.id, match[1]];
  }

  private async getWishlistScreenshot() {
    let products = await this.productService.getWishlist();
    const path = await uploadWishlistScreenshot(products);
    return [path, products];
  }
}
