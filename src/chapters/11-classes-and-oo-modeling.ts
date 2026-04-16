import { createChapter, section, show } from "../shared/chapter";

interface Logger {
  log(message: string): void;
}

class ConsoleLogger implements Logger {
  log(message: string): void {
    console.log(`[logger] ${message}`);
  }
}

abstract class Payment {
  constructor(public readonly orderId: string) {}

  abstract pay(amount: number): string;

  printOrder(): string {
    return `order=${this.orderId}`;
  }
}

class WechatPayment extends Payment {
  pay(amount: number): string {
    return `wechat paid ${amount}`;
  }
}

export const chapter11 = createChapter({
  id: "11",
  title: "类、抽象类与面向对象建模",
  articlePath: "docs/typescript-series/11-类抽象类与面向对象建模.md",
  summary: "展示类系统适合处理实例、封装和共享实现的场景。",
  run() {
    section("接口 + 实现");
    const logger = new ConsoleLogger();
    logger.log("class example running");

    section("抽象类");
    const payment = new WechatPayment("order-101");
    show("printOrder", payment.printOrder());
    show("pay", payment.pay(199));
  }
});
