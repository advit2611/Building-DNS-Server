import * as dgram from "dgram";
import DNSHeader, { OpCode, RCode, TDNSHeader } from "./dns/header";
import DNSQusetion, { IDNSQuestion, QClass, QType } from "./dns/question";
import DNSAnswer, { IDNSAnswer } from "./dns/answer";

const defaultHeaders: TDNSHeader = {
    id : 1234,
    qr: 1 << 15,
    opcode: OpCode.STANDARD_QUERY,
    aa: 0,
    tc: 0,
    rd: 0,
    ra: 0,
    z: 0,
    rcode: RCode.NO_ERROR,
    qdcount: 0,
    ancount: 0,
    nscount: 0,
    arcount: 0
}

const defaultQuestion: IDNSQuestion = {
    qname: "codecrafters.io",
    qtype: QType.A,
    qclass: QClass.IN,
}

const defaultAnswer: IDNSAnswer = {
    name: "codecrafters.io",
    qtype: QType.A,
    qclass: QClass.IN,
    ttl: 60,
    data: '\x08\x08\x08\x08'
}

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this block to pass the first stage
//
const udpSocket: dgram.Socket = dgram.createSocket("udp4");
udpSocket.bind(2053, "127.0.0.1");

udpSocket.on("message", (data: Buffer, remoteAddr: dgram.RemoteInfo) => {
    try {
        console.log(`Received data from ${remoteAddr.address}:${remoteAddr.port}`);

        const header = DNSHeader.write({...defaultHeaders, qdcount: 1, ancount: 1})
        const question = DNSQusetion.write([defaultQuestion])
        const answer = DNSAnswer.write([defaultAnswer])

        const response = Buffer.concat([header, question, answer]);
        udpSocket.send(response, remoteAddr.port, remoteAddr.address);
    } catch (e) {
        console.log(`Error sending data: ${e}`);
    }
});
