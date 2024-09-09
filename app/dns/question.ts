export enum QType {
  A = 1,
  CNAME = 5,
}

export enum QClass {
  IN = 1,
}

export interface IDNSQuestion {
  qname: string;
  qtype: QType;
  qclass: QClass;
}

class DNSQusetion {
  static write(questions: IDNSQuestion[]) {
    return Buffer.concat(
      questions.map((question) => {
        const str = question.qname
          .split(".")
          .map((n) => `${String.fromCharCode(n.length)}${n}`)
          .join("");

        const qnameBuffer = Buffer.from(str, "binary");

        const nullTerminator = Buffer.from([0]);

        const typeAndClass = Buffer.alloc(4);
        typeAndClass.writeUint16BE(question.qtype, 0);
        typeAndClass.writeUint16BE(question.qclass, 2);

        return Buffer.concat([qnameBuffer, nullTerminator, typeAndClass]);
      })
    );
  }
}

export default DNSQusetion;
