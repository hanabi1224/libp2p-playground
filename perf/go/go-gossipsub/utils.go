package main

import (
	"encoding/json"
	"fmt"
	"os"
	"time"

	"github.com/libp2p/go-libp2p"
	"github.com/libp2p/go-libp2p-core/host"
	pubsub "github.com/libp2p/go-libp2p-pubsub"
)

type Payload struct {
	From      int   `json:"from"`
	Timestamp int64 `json:"ts"`
}

type P2PNode struct {
	host  host.Host
	index int
	ps    *pubsub.PubSub
	topic *pubsub.Topic
	sub   *pubsub.Subscription
}

func (n *P2PNode) publishMessage() {
	bytes, err := json.Marshal(Payload{From: n.index, Timestamp: time.Now().UnixMilli()})
	if err != nil {
		panic(err)
	}
	n.topic.Publish(CTX, bytes)
}

func (n *P2PNode) readLoop() {
	var minLatency int64 = 0
	var maxLatency int64 = 0
	var totalMS float64 = 0
	var totalMsg float64 = 0
	for {
		msg, err := n.sub.Next(CTX)
		if err != nil {
			fmt.Fprint(os.Stderr, err)
			return
		}
		if msg == nil || msg.ReceivedFrom == n.host.ID() {
			continue
		}
		ts := time.Now().UnixMilli()
		var payload Payload
		json.Unmarshal(msg.Data, &payload)
		latency := ts - payload.Timestamp
		if minLatency == 0 || minLatency > latency {
			minLatency = latency
		}
		if maxLatency == 0 || maxLatency < latency {
			maxLatency = latency
		}
		totalMS += float64(latency)
		totalMsg += 1
		if PRINT_RECEIVED_MSG {
			fmt.Printf("node %d received %s, latency: %dms\n", n.index, string(msg.Data), latency)
		}
		// if PRINT_AVG_LATENCY {
		if PRINT_AVG_LATENCY && int(totalMsg) == N_NODES-1 {
			fmt.Printf("node %d msg latency, avg: %fms, max: %dms, min: %dms\n", n.index, totalMS/totalMsg, maxLatency, minLatency)
			wg.Done()
		}
	}
}

func createPeer(index int) P2PNode {
	h, err := libp2p.New(libp2p.ListenAddrStrings("/ip4/0.0.0.0/tcp/0/ws"))
	if err != nil {
		panic(err)
	}
	ps, err := pubsub.NewGossipSub(CTX, h)
	if err != nil {
		panic(err)
	}
	topic, err := ps.Join(TOPIC)
	if err != nil {
		panic(err)
	}
	sub, err := topic.Subscribe()
	if err != nil {
		panic(err)
	}
	node := P2PNode{host: h, index: index, ps: ps, topic: topic, sub: sub}
	return node
}
