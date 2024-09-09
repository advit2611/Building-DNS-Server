import { QClass, QType } from "./question";

export interface IDNSAnswer {
  name: string;
  qtype: QType;
  qclass: QClass;
  ttl: number;
  data: string;
}

class DNSAnswer {
  static write(answers: IDNSAnswer[]) {
    return Buffer.concat(
      answers.map((answer) => {
        const str = answer.name
          .split(".")
          .map((n) => `${String.fromCharCode(n.length)}${n}`)
          .join("");

        const qnameBuffer = Buffer.from(str, "binary");

        const nullTerminator = Buffer.from([0]);

        const typeAndClass = Buffer.alloc(10);
        typeAndClass.writeUint16BE(answer.qtype, 0);
        typeAndClass.writeUint16BE(answer.qclass, 2);
        typeAndClass.writeUint16BE(answer.ttl, 2);
        typeAndClass.writeUint16BE(answer.data.length, 2);

        const data = Buffer.from(answer.data + "\0", "binary");

        return Buffer.concat([qnameBuffer, nullTerminator, typeAndClass, data]);
      })
    );
  }
}

export default DNSAnswer
