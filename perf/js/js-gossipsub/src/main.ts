import PeerId from 'peer-id'
import { createPeer, P2PNode, uint8ArrayFromString, uint8ArrayToString } from "./utils"

const DISCOVERY_HOOK = true
const TOPIC = 'news'
// number of nodes
const N_NODES = 100
const N_CONNECT = 2
const ID_SUM = N_NODES * (N_NODES - 1) / 2

interface Payload {
    // From node index
    from: number,
    // Timestamp
    ts: number,
}

function setOnDiscoveryHook(node: P2PNode, id2Nodes: Map<String, P2PNode>) {
    node.p.on('peer:discovery', (peerId: PeerId) => console.log(`[node ${node.index}] Discovered: node ${id2Nodes.get(peerId.toB58String())?.index}`))
}

function subscribeTopic(node: P2PNode) {
    node.p.pubsub.on(TOPIC, (msg) => {
        const ts = new Date().getTime()
        const payloadStr = uint8ArrayToString(msg.data)
        const payload: Payload = JSON.parse(payloadStr)
        console.log(`node ${node.index} received: ${uint8ArrayToString(msg.data)} at ${ts}, duration ${ts - payload.ts}ms`)
    })
    node.p.pubsub.subscribe(TOPIC)
}

async function main() {
    const nodes: P2PNode[] = []
    const id2Nodes = new Map<String, P2PNode>()
    // Create nodes
    for (var i = 0; i < N_NODES; i++) {
        const node = await createPeer(i)
        nodes.push(node)
        id2Nodes.set(node.pid, node)
        if (DISCOVERY_HOOK) {
            setOnDiscoveryHook(node, id2Nodes)
        }
        subscribeTopic(node)
    }
    // Connect nodes
    for (var i = 0; i < N_NODES; i++) {
        const node = nodes[i]
        for (var j = 1; j <= N_CONNECT; j += 1) {
            const other = nodes[(i + j) % N_NODES]
            await node.p.peerStore.addressBook.set(other.p.peerId, other.p.multiaddrs)
            await node.p.dial(other.p.peerId)
        }
    }
    for (var i = 0; i < N_NODES; i++) {
        const node = nodes[i]
        node.p.pubsub.publish(TOPIC, uint8ArrayFromString(JSON.stringify({
            from: i,
            ts: new Date().getTime()
        } as Payload)))
    }
}

main()
